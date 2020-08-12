import axios from "axios";
import isCancel from "axios/lib/cancel/isCancel";
/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
    constructor(axios, handlers, config) {
        this.axios = axios;
        this.handlers = handlers;
        this.config = config;
    }
    request(config) {
        const usedConfig = Object.assign({}, config);
        const __axios = this.axios;
        return async function (paramsOrData, requestData) {
            requestData = requestData || {};
            if (["post", "put", "patch"].includes(usedConfig.method)) {
                requestData.data = paramsOrData;
            } else {
                requestData.params = paramsOrData;
            }
            const notNext = usedConfig.handler?.preRequest?.(requestData) === false;
            if (usedConfig.dataSerializer) {
                requestData.data = usedConfig.dataSerializer(requestData.data);
            }
            usedConfig.url = pathRender(usedConfig.url, requestData?.pathVariables);
            usedConfig["params"] = requestData?.params;
            usedConfig["data"] = requestData?.data;
            if (notNext) {
                throw new axios.Cancel(`Cancel Request: ${usedConfig.method} ${usedConfig.url}`);
            }
            try {
                const promise = await __axios.request(usedConfig);
                usedConfig.handler?.onThen?.(requestData, promise);
                return usedConfig.extractData === false ? promise : promise.data;
            } catch (e) {
                if (isCancel(e)) {
                    throw e;
                }
                usedConfig.handler?.onCatch?.(requestData, e);
                throw usedConfig.extractData === false ? e : e.response.data;
            }
        };
    }
    /**
     * GET 请求
     */
    get(url, config) {
        const merged = mergeConfig(this.config, config);
        merged.url = url;
        merged.method = "get";
        merged.handler = merged.handler || this.handlers?.onGet;
        return this.request(merged);
    }
    /**
     * POST 请求
     */
    post(url, config) {
        const merged = mergeConfig(this.config, config);
        merged.url = url;
        merged.method = "post";
        merged.handler = merged.handler || this.handlers?.onPost;
        return this.request(merged);
    }
    /**
     * POST 请求, Content-Type 为 application/x-www-form-urlencoded
     */
    postForm(url, config) {
        (config || {}).dataSerializer = stringify;
        return this.post(url, config);
    }
    /**
     * POST 请求, Content-Type 为 multipart/form-data
     */
    postFormData(url, config) {
        (config || {}).dataSerializer = formDataSerializer;
        return this.post(url, config);
    }
    /**
     * PUT 请求
     */
    put(url, config) {
        const merged = mergeConfig(this.config, config);
        merged.url = url;
        merged.method = "put";
        merged.handler = merged.handler || this.handlers?.onPut;
        return this.request(merged);
    }
    /**
     * DELETE 请求
     */
    delete(url, config) {
        const merged = mergeConfig(this.config, config);
        merged.url = url;
        merged.method = "delete";
        merged.handler = merged.handler || this.handlers?.onDelete;
        return this.request(merged);
    }
}
/**
 * 将对象字符串化成 application/x-www-form-urlencoded 所需的格式
 */
export function stringify(object) {
    if (!object) {
        return "";
    }
    if (typeof object !== "object") {
        throw new TypeError(`Expect: 'object' type, Actual: '${typeof object}' type`);
    }
    const rs = [];
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            rs.push(`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`);
        }
    }
    return rs.join("&").replace(/%20/g, "+");
}
export function formDataSerializer(data) {
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            formData.append(key, data[key]);
        }
    }
    return formData;
}
/**
 * 路径变量解析
 */
export function pathRender(path, pathVariables) {
    let rs = path;
    if (pathVariables) {
        for (const key in pathVariables) {
            if (Object.prototype.hasOwnProperty.call(pathVariables, key)) {
                rs = rs.replace(`{${key}}`, "" + pathVariables[key]);
            }
        }
    }
    return rs;
}
export function mergeConfig(clientConfig, methodConfig) {
    if (!methodConfig) {
        return clientConfig || {};
    }
    for (const mc in methodConfig) {
        if (
            Object.prototype.hasOwnProperty.call(methodConfig, mc) &&
            methodConfig[mc] === undefined &&
            Object.prototype.hasOwnProperty.call(clientConfig, mc) &&
            clientConfig?.[mc] !== undefined
        ) {
            methodConfig[mc] = clientConfig[mc];
        }
    }
    return methodConfig;
}
