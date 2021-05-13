import axiosRequest from "./axiosRequest";
import stringify from "./stringify";
import formDataSerializer from "./formDataSerializer";
/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
    constructor(axios, config) {
        this.axios = axios;
        this._config = config;
    }
    request(config = {}) {
        const _axios = this.axios;
        const _config = mergeConfig(this._config, config);
        return async function (requestData) {
            const config = Object.assign({}, _config);
            config.pathVariables = requestData?.pathVariables;
            config.data = requestData?.data;
            config.params = requestData?.params;
            return axiosRequest(_axios, config);
        };
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
        return this.request(config);
    }
    /**
     * POST 请求
     */
    post(url, config = {}) {
        config.url = url;
        config.method = "post";
        return this.request(config);
    }
    /**
     * POST 请求, Content-Type 为 application/x-www-form-urlencoded，一般用于表单的原始提交。
     */
    postForm(url, config = {}) {
        config.url = url;
        config.method = "post";
        config.dataSerializer = stringify;
        return this.request(config);
    }
    /**
     * POST 请求, Content-Type 为 multipart/form-data, 一般用于文件上传。
     */
    postFormData(url, config = {}) {
        config.url = url;
        config.method = "post";
        config.dataSerializer = formDataSerializer;
        return this.request(config);
    }
    /**
     * PUT 请求
     */
    put(url, config = {}) {
        config.url = url;
        config.method = "put";
        return this.request(config);
    }
    /**
     * PATCH 请求
     */
    patch(url, config = {}) {
        config.url = url;
        config.method = "patch";
        return this.request(config);
    }
    /**
     * DELETE 请求
     */
    delete(url, config = {}) {
        config.url = url;
        config.method = "delete";
        return this.request(config);
    }
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
