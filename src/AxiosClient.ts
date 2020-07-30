import axios, {
    AxiosAdapter,
    AxiosBasicCredentials,
    AxiosInstance,
    AxiosProxyConfig,
    AxiosResponse,
    AxiosTransformer,
    CancelToken,
    Method,
    ResponseType,
} from "axios";

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
        const __axios: AxiosInstance = this.axios;
        return async function (
            paramsOrData?: P | D,
            requestData?: AxiosClientRequestData<P, D, V>
        ) {
            requestData = requestData || {};
            if (["post", "put", "patch"].includes(config.method)) {
                requestData.data = paramsOrData as D;
            } else {
                requestData.params = paramsOrData as P;
            }
            const notNext = config.handler?.beforeRequest?.(requestData) === false;
            if (config.dataSerializer) {
                requestData.data = config.dataSerializer(requestData.data) as any;
            }
            config.url = pathRender(config.url, requestData?.pathVariables);
            config["params"] = requestData?.params;
            config["data"] = requestData?.data;
            config.paramsSerializer = config.paramsSerializer || stringify;

            if (notNext) {
                throw new axios.Cancel(`Cancel Request: ${config.method} ${config.url}`);
            }
            const promise = await __axios.request(config);
            config.handler?.afterResponse?.(requestData, promise);
            return config.extractData === false ? promise : promise.data;
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
        (config || ({} as AxiosClientMethodConfig)).dataSerializer = stringify;
        return this.post<D, V>(url, config);
    }

    /**
     * POST 请求, Content-Type 为 multipart/form-data
     */
    postFormData<D = FormBlob, V = Simple>(url: string, config?: AxiosClientMethodConfig) {
        (config || ({} as AxiosClientMethodConfig)).dataSerializer = formDataSerializer;
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
            formData.append(key, data[key] as any);
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
                rs = path.replace(`{${key}}`, "" + pathVariables[key]);
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
    beforeRequest?: (requestData) => boolean;
    afterResponse?: (requestData, response: AxiosResponse) => void;
}

export interface Handlers {
    onGet?: Handler;
    onPost?: Handler;
    onPut?: Handler;
    onDelete?: Handler;
}

export interface AxiosClientConfig {
    extractData?: boolean;
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
