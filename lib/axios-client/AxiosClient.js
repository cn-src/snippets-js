import AxiosClientRequest from "./AxiosClientRequest";
/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
    constructor(axios, config) {
        this.axios = axios;
        this._config = config;
    }
    request(config) {
        return new AxiosClientRequest(this.axios, mergeConfig(this._config, config));
    }
    config(config) {
        this._config = config;
        return this;
    }
    /**
     * GET 请求
     */
    get(url, config = {}) {
        config.method = "get";
        config.url = url;
        const merged = mergeConfig(this._config, config);
        return new AxiosClientRequest(this.axios, merged);
    }
    /**
     * POST 请求
     */
    post(url, config = {}) {
        config.url = url;
        config.method = "post";
        const merged = mergeConfig(this._config, config);
        return new AxiosClientRequest(this.axios, merged);
    }
    /**
     * POST 请求, Content-Type 为 application/x-www-form-urlencoded
     */
    postForm(url, config = {}) {
        config.url = url;
        config.method = "post";
        config.dataSerializer = stringify;
        const merged = mergeConfig(this._config, config);
        return new AxiosClientRequest(this.axios, merged);
    }
    /**
     * POST 请求, Content-Type 为 multipart/form-data
     */
    postFormData(url, config = {}) {
        config.url = url;
        config.method = "post";
        config.dataSerializer = formDataSerializer;
        const merged = mergeConfig(this._config, config);
        return new AxiosClientRequest(this.axios, merged);
    }
    /**
     * PUT 请求
     */
    put(url, config = {}) {
        config.url = url;
        config.method = "put";
        const merged = mergeConfig(this._config, config);
        return new AxiosClientRequest(this.axios, merged);
    }
    /**
     * PATCH 请求
     */
    patch(url, config = {}) {
        config.url = url;
        config.method = "patch";
        const merged = mergeConfig(this._config, config);
        return new AxiosClientRequest(this.axios, merged);
    }
    /**
     * DELETE 请求
     */
    delete(url, config = {}) {
        config.url = url;
        config.method = "delete";
        const merged = mergeConfig(this._config, config);
        return new AxiosClientRequest(this.axios, merged);
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
export function searchParams(params) {
    if (!params || params instanceof URLSearchParams) {
        return params;
    }
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(function (key) {
        if (Array.isArray(params[key])) {
            Object.keys(params[key]).forEach(function (subKey) {
                searchParams.append(key, params[key][subKey]);
            });
        } else {
            searchParams.append(key, params[key]);
        }
    });
    return searchParams;
}
export function formDataSerializer(data) {
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (Array.isArray(value)) {
                value.forEach((it) => formData.append(key, it));
            } else {
                formData.append(key, value);
            }
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
    methodConfig = methodConfig || {};
    for (const cc in clientConfig) {
        if (!Object.prototype.hasOwnProperty.call(clientConfig, cc)) {
            continue;
        }
        if (methodConfig[cc] !== undefined) {
            continue;
        }
        if (["onGet", "onPost", "onPut", "onPatch", "onDelete"].includes(cc)) {
            const method = methodConfig.method?.toLowerCase() || "";
            if (cc.toLowerCase() === "on" + method) {
                methodConfig[cc] = clientConfig[cc];
            }
            continue;
        }
        methodConfig[cc] = clientConfig[cc];
    }
    return methodConfig;
}
