import axios, {
    AxiosAdapter,
    AxiosBasicCredentials,
    AxiosInstance,
    AxiosProxyConfig,
    AxiosResponse,
    AxiosTransformer,
    CancelToken,
    Method,
    ResponseType
} from "axios";

import isCancel from "axios/lib/cancel/isCancel";

/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
    private readonly axios: AxiosInstance;
    private readonly handlers?: Handlers;
    private readonly config?: AxiosClientConfig;

    constructor(axios: AxiosInstance, handlers?: Handlers, config?: AxiosClientConfig) {
        this.axios = axios;
        this.handlers = handlers;
        this.config = config;
    }

    request<P, D, V>(config: AxiosClientRequestConfig) {
        const usedConfig = Object.assign({}, config);
        const __axios: AxiosInstance = this.axios;
        return async function(
            paramsOrData?: P | D,
            requestData?: AxiosClientRequestData<P, D, V>
        ) {
            requestData = requestData || {};
            if (paramsOrData) {
                if (["post", "put", "patch"].includes(usedConfig.method)) {
                    requestData.data = paramsOrData as D;
                } else {
                    requestData.params = paramsOrData as P;
                }
            }
            const notNext = usedConfig.handler?.preRequest?.(requestData) === false;
            if (usedConfig.dataSerializer) {
                requestData.data = usedConfig.dataSerializer(requestData.data) as any;
            }
            usedConfig.url = pathRender(config.url, requestData?.pathVariables);
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
                // TODO
                // throw usedConfig.extractData === false ? e : e.response.data;
                throw e;
            }
        };
    }

    /**
     * GET 请求
     */
    get<P = Simple, V = Simple>(url: string, config?: AxiosClientMethodConfig) {
        const merged = mergeConfig(this.config, config);
        merged.url = url;
        merged.method = "get";
        merged.handler = merged.handler || this.handlers?.onGet;
        return this.request<P, never, V>(merged);
    }

    /**
     * POST 请求
     */
    post<D = Json, V = Simple>(url: string, config?: AxiosClientMethodConfig) {
        const merged = mergeConfig(this.config, config);
        merged.url = url;
        merged.method = "post";
        merged.handler = merged.handler || this.handlers?.onPost;
        return this.request<never, D, V>(merged);
    }

    /**
     * POST 请求, Content-Type 为 application/x-www-form-urlencoded
     */
    postForm<D = Simple, V = Simple>(url: string, config?: AxiosClientMethodConfig) {
        config = config || ({} as AxiosClientMethodConfig);
        config.dataSerializer = stringify;
        return this.post<D, V>(url, config);
    }

    /**
     * POST 请求, Content-Type 为 multipart/form-data
     */
    postFormData<D = FormBlob, V = Simple>(url: string, config?: AxiosClientMethodConfig) {
        config = config || ({} as AxiosClientMethodConfig);
        config.dataSerializer = formDataSerializer;
        return this.post<D, V>(url, config);
    }

    /**
     * PUT 请求
     */
    put<D = Json, V = Simple>(url: string, config?: AxiosClientMethodConfig) {
        const merged = mergeConfig(this.config, config);
        merged.url = url;
        merged.method = "put";
        merged.handler = merged.handler || this.handlers?.onPut;
        return this.request<never, D, V>(merged);
    }

    /**
     * PATCH 请求
     */
    patch<D = Json, V = Simple>(url: string, config?: AxiosClientMethodConfig) {
        const merged = mergeConfig(this.config, config);
        merged.url = url;
        merged.method = "patch";
        merged.handler = merged.handler || this.handlers?.onPatch;
        return this.request<never, D, V>(merged);
    }

    /**
     * DELETE 请求
     */
    delete<P = Simple, V = Simple>(url: string, config?: AxiosClientMethodConfig) {
        const merged = mergeConfig(this.config, config);
        merged.url = url;
        merged.method = "delete";
        merged.handler = merged.handler || this.handlers?.onDelete;
        return this.request<P, never, V>(merged);
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

export function mergeConfig(
    clientConfig?: AxiosClientConfig,
    methodConfig?: AxiosClientMethodConfig
): AxiosClientRequestConfig {
    if (!methodConfig) {
        return (clientConfig || {}) as AxiosClientRequestConfig;
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
    return methodConfig as AxiosClientRequestConfig;
}

/**
 * 属性全部为简单类型的对象
 */
export type Simple = { [propName: string]: string | number | boolean };

/**
 * 类似 JSON 一样, 属性以及子属性全部为简单类型
 */
export type Json = {
    [propName: string]: string | number | boolean | Json;
};

export type FormBlob = { [propName: string]: string | Blob };

export interface Handler {
    /**
     * 请求之前的处理，返回 false 则取消请求
     */
    preRequest?: (requestData) => boolean;

    /**
     * 响应成功 then 的处理
     */
    onThen?: (requestData, response: AxiosResponse) => void;

    /**
     * 响应失败 catch 的处理, 不处理取消请求产生的错误
     */
    onCatch?: (requestData, error: AxiosResponse) => void;
}

export interface Handlers {
    onGet?: Handler;
    onPost?: Handler;
    onPut?: Handler;
    onPatch?: Handler;
    onDelete?: Handler;
}

export interface AxiosClientConfig {
    /**
     * 提取响应的 data 部分
     */
    extractData?: boolean;

    /**
     * 提取 catch 的 data 部分
     */
    extractCatchData?: boolean;
    baseURL?: string;
    transformRequest?: AxiosTransformer | AxiosTransformer[];
    transformResponse?: AxiosTransformer | AxiosTransformer[];
    headers?: any;
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    adapter?: AxiosAdapter;
    auth?: AxiosBasicCredentials;
    responseType?: ResponseType;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    validateStatus?: (status: number) => boolean;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
    proxy?: AxiosProxyConfig | false;
    cancelToken?: CancelToken;
}

export interface AxiosClientMethodConfig extends AxiosClientConfig {
    handler: Handler;
    paramsSerializer?: (params: any) => string;
    dataSerializer?: (params: any) => string | FormData;
}

export interface AxiosClientRequestConfig extends AxiosClientMethodConfig {
    url: string;
    method: Method;
}

export interface AxiosClientRequestData<P, D, V> {
    pathVariables?: V;
    params?: P;
    data?: D;

    [prop: string]: any;
}
