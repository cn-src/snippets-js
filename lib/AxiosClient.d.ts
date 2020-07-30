import {
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
    private readonly axios;
    private readonly handlers?;
    private readonly config?;
    constructor(axios: AxiosInstance, handlers?: Handlers, config?: AxiosClientConfig);
    request<P, D, V>(
        config: AxiosClientRequestConfig
    ): (
        paramsOrData?: P | D | undefined,
        requestData?: AxiosClientRequestData<P, D, V> | undefined
    ) => Promise<any>;
    /**
     * GET 请求
     */
    get<P = Simple, V = Simple>(
        url: string,
        config?: AxiosClientMethodConfig
    ): (
        paramsOrData?: P | undefined,
        requestData?: AxiosClientRequestData<P, never, V> | undefined
    ) => Promise<any>;
    /**
     * POST 请求
     */
    post<D = Json, V = Simple>(
        url: string,
        config?: AxiosClientMethodConfig
    ): (
        paramsOrData?: D | undefined,
        requestData?: AxiosClientRequestData<never, D, V> | undefined
    ) => Promise<any>;
    /**
     * POST 请求, Content-Type 为 application/x-www-form-urlencoded
     */
    postForm<D = Simple, V = Simple>(
        url: string,
        config?: AxiosClientMethodConfig
    ): (
        paramsOrData?: D | undefined,
        requestData?: AxiosClientRequestData<never, D, V> | undefined
    ) => Promise<any>;
    /**
     * POST 请求, Content-Type 为 multipart/form-data
     */
    postFormData<D = FormBlob, V = Simple>(
        url: string,
        config?: AxiosClientMethodConfig
    ): (
        paramsOrData?: D | undefined,
        requestData?: AxiosClientRequestData<never, D, V> | undefined
    ) => Promise<any>;
    /**
     * PUT 请求
     */
    put<D = Json, V = Simple>(
        url: string,
        config?: AxiosClientMethodConfig
    ): (
        paramsOrData?: D | undefined,
        requestData?: AxiosClientRequestData<never, D, V> | undefined
    ) => Promise<any>;
    /**
     * DELETE 请求
     */
    delete<P = Simple, V = Simple>(
        url: string,
        config?: AxiosClientMethodConfig
    ): (
        paramsOrData?: P | undefined,
        requestData?: AxiosClientRequestData<P, never, V> | undefined
    ) => Promise<any>;
}
/**
 * 将对象字符串化成 application/x-www-form-urlencoded 所需的格式
 */
export declare function stringify(object: any): string;
export declare function formDataSerializer(data: any): FormData;
/**
 * 路径变量解析
 */
export declare function pathRender<T = Simple>(path: string, pathVariables?: T): string;
export declare function mergeConfig(
    clientConfig?: AxiosClientConfig,
    methodConfig?: AxiosClientMethodConfig
): AxiosClientRequestConfig;
/**
 * 属性全部为简单类型的对象
 */
export declare type Simple = {
    [propName: string]: string | number | boolean;
};
/**
 * 类似 JSON 一样, 属性以及子属性全部为简单类型
 */
export declare type Json = {
    [propName: string]: string | number | boolean | Json;
};
export declare type FormBlob = {
    [propName: string]: string | Blob;
};
export interface Handler {
    /**
     * 请求之前的处理，返回 false 则取消请求
     */
    preRequest?: (requestData: any) => boolean;
    /**
     * 响应成功 then 的处理
     */
    onThen?: (requestData: any, response: AxiosResponse) => void;
    /**
     * 响应失败 catch 的处理, 不处理取消请求产生的错误
     */
    onCatch?: (requestData: any, response: AxiosResponse) => void;
}
export interface Handlers {
    onGet?: Handler;
    onPost?: Handler;
    onPut?: Handler;
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
