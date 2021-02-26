import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosClientRequest from "./AxiosClientRequest";

/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
    private readonly axios: AxiosInstance;
    private readonly config?: AxiosClientConfig;

    constructor(axios: AxiosInstance, config?: AxiosClientConfig) {
        this.axios = axios;
        this.config = config;
    }

    request<PV, P, D>(config: AxiosClientRequestConfig<PV, P, D>) {
        return new AxiosClientRequest<PV, P, D>(this.axios, mergeConfig(this.config, config));
    }

    /**
     * GET 请求
     */
    get<PV = Simple, P = Simple>(url: string, config: AxiosClientRequestConfig<PV, P, never> = {}) {
        config.method = "get";
        config.url = url;
        const merged = mergeConfig(this.config, config);
        return new AxiosClientRequest<PV, P, never>(this.axios, merged);
    }

    /**
     * POST 请求
     */
    post<PV = Simple, D = Json>(url: string, config: AxiosClientRequestConfig<PV, never, D> = {}) {
        config.url = url;
        config.method = "post";
        const merged = mergeConfig(this.config, config);
        return new AxiosClientRequest<PV, never, D>(this.axios, merged);
    }

    /**
     * POST 请求, Content-Type 为 application/x-www-form-urlencoded
     */
    postForm<PV = Simple, D = Simple>(
        url: string,
        config: AxiosClientRequestConfig<PV, never, D> = {}
    ) {
        config.url = url;
        config.method = "post";
        config.dataSerializer = stringify;
        const merged = mergeConfig(this.config, config);
        return new AxiosClientRequest<PV, never, D>(this.axios, merged);
    }

    /**
     * POST 请求, Content-Type 为 multipart/form-data
     */
    postFormData<PV = Simple, D = FormBlob>(
        url: string,
        config: AxiosClientRequestConfig<PV, never, D> = {}
    ) {
        config.url = url;
        config.method = "post";
        config.dataSerializer = formDataSerializer;
        const merged = mergeConfig(this.config, config);
        return new AxiosClientRequest<PV, never, D>(this.axios, merged);
    }

    /**
     * PUT 请求
     */
    put<PV = Simple, D = Json>(url: string, config: AxiosClientRequestConfig<PV, never, D> = {}) {
        config.url = url;
        config.method = "put";
        const merged = mergeConfig(this.config, config);
        return new AxiosClientRequest<PV, never, D>(this.axios, merged);
    }

    /**
     * PATCH 请求
     */
    patch<PV = Simple, D = Json>(url: string, config: AxiosClientRequestConfig<PV, never, D> = {}) {
        config.url = url;
        config.method = "patch";
        const merged = mergeConfig(this.config, config);
        return new AxiosClientRequest<PV, never, D>(this.axios, merged);
    }

    /**
     * DELETE 请求
     */
    delete<PV = Simple, P = Simple>(
        url: string,
        config: AxiosClientRequestConfig<PV, P, never> = {}
    ) {
        config.url = url;
        config.method = "delete";
        const merged = mergeConfig(this.config, config);
        return new AxiosClientRequest<PV, P, never>(this.axios, merged);
    }
}

/**
 * 将对象字符串化成 application/x-www-form-urlencoded 所需的格式
 */
export function stringify(object: any): string {
    if (!object) {
        return "";
    }
    if (typeof object !== "object") {
        throw new TypeError(`Expect: 'object' type, Actual: '${typeof object}' type`);
    }
    const rs: string[] = [];
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            rs.push(`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`);
        }
    }
    return rs.join("&").replace(/%20/g, "+");
}

export function searchParams(params: any) {
    if (!params || params instanceof URLSearchParams) {
        return params;
    }
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(function(key) {
        if (Array.isArray(params[key])) {
            Object.keys(params[key]).forEach(function(subKey) {
                searchParams.append(key, params[key][subKey]);
            });
        } else {
            searchParams.append(key, params[key]);
        }
    });
    return searchParams;
}

export function formDataSerializer(data: any) {
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (Array.isArray(value)) {
                value.forEach((it) => formData.append(key, it as any));
            } else {
                formData.append(key, value as any);
            }
        }
    }
    return formData;
}

/**
 * 路径变量解析
 */
export function pathRender<T = Simple>(path: string, pathVariables?: T) {
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

export function mergeConfig<PV, P, D>(
    clientConfig?: AxiosClientConfig,
    methodConfig?: AxiosClientRequestConfig<PV, P, D>
): AxiosClientRequestConfig<PV, P, D> {
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

/**
 * 原始类型以及其数组类型
 */
export type Primitive = string | number | boolean | [string] | [number] | [boolean]

/**
 * 属性全部为简单类型的对象
 */
export type Simple = { [propName: string]: Primitive };

/**
 * 类似 JSON 一样, 属性以及子属性全部为简单类型
 */
export type Json = {
    [propName: string]: Primitive | Json;
};

export type FormBlob = { [propName: string]: string | Blob };

export type PreRequest<PV, P, D> = (requestData: AxiosClientRequestData<PV, P, D>) => boolean;
export type OnThen<PV, P, D> = (
    requestData: AxiosClientRequestData<PV, P, D>,
    response: AxiosResponse
) => void;
export type OnCatch<PV, P, D> = (
    requestData: AxiosClientRequestData<PV, P, D>,
    error: AxiosResponse
) => void;

export interface Handler<PV, P, D> {
    /**
     * 请求之前的处理，返回 false 则取消请求
     */
    preRequest?: PreRequest<PV, P, D>;

    /**
     * 响应成功 then 的处理
     */
    onThen?: OnThen<PV, P, D>;

    /**
     * 响应失败 catch 的处理, 不处理取消请求产生的错误
     */
    onCatch?: OnCatch<PV, P, D>;
}

export interface AxiosClientConfig extends AxiosRequestConfig {
    /**
     * 提取响应的 data 部分
     */
    extractData?: boolean;

    /**
     * 提取 catch 的 data 部分
     */
    extractCatchData?: boolean;

    onGet?: Handler<any, any, any>;
    onPost?: Handler<any, any, any>;
    onPut?: Handler<any, any, any>;
    onPatch?: Handler<any, any, any>;
    onDelete?: Handler<any, any, any>;
}

export interface AxiosClientRequestConfig<PV, P, D> extends AxiosRequestConfig {
    pathParams?: PV;
    params?: P;
    data?: D;

    /**
     * 提取响应的 data 部分
     */
    extractData?: boolean;

    /**
     * 提取 catch 的 data 部分
     */
    extractCatchData?: boolean;

    dataSerializer?: (params: any) => string | FormData;

    /**
     * 请求之前的处理，返回 false 则取消请求
     */
    preRequest?: PreRequest<PV, P, D>;

    /**
     * 响应成功 then 的处理
     */
    onThen?: OnThen<PV, P, D>;

    /**
     * 响应失败 catch 的处理, 不处理取消请求产生的错误
     */
    onCatch?: OnCatch<PV, P, D>;
}

export interface AxiosClientRequestData<PV, P, D> {
    pathParams?: PV;
    params?: P;
    data?: D;

    [prop: string]: any;
}
