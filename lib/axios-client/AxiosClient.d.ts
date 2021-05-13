import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
    private readonly axios;
    private _config?;
    constructor(axios: AxiosInstance, config?: AxiosClientConfig);
    request<D, PV, P>(
        config?: AxiosClientRequestConfig<D, PV, P>
    ): (requestData?: AxiosClientRequestData<D, PV, P> | undefined) => Promise<any>;
    config(config: AxiosClientConfig): this;
    /**
     * GET 请求
     */
    get<P = Simple, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<never, PV, P>
    ): (requestData?: AxiosClientRequestData<never, PV, P> | undefined) => Promise<any>;
    /**
     * POST 请求
     */
    post<D = Json, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<D, PV, never>
    ): (requestData?: AxiosClientRequestData<D, PV, never> | undefined) => Promise<any>;
    /**
     * POST 请求, Content-Type 为 application/x-www-form-urlencoded，一般用于表单的原始提交。
     */
    postForm<D = Simple, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<D, PV, never>
    ): (requestData?: AxiosClientRequestData<D, PV, never> | undefined) => Promise<any>;
    /**
     * POST 请求, Content-Type 为 multipart/form-data, 一般用于文件上传。
     */
    postFormData<D = FormBlob, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<D, PV, never>
    ): (requestData?: AxiosClientRequestData<D, PV, never> | undefined) => Promise<any>;
    /**
     * PUT 请求
     */
    put<D = Json, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<D, PV, never>
    ): (requestData?: AxiosClientRequestData<D, PV, never> | undefined) => Promise<any>;
    /**
     * PATCH 请求
     */
    patch<D = Json, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<D, PV, never>
    ): (requestData?: AxiosClientRequestData<D, PV, never> | undefined) => Promise<any>;
    /**
     * DELETE 请求
     */
    delete<P = Simple, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<never, PV, P>
    ): (requestData?: AxiosClientRequestData<never, PV, P> | undefined) => Promise<any>;
}
export declare function mergeConfig<D, PV, P>(
    clientConfig?: AxiosClientConfig,
    methodConfig?: AxiosClientRequestConfig<D, PV, P>
): AxiosClientRequestConfig<D, PV, P>;
/**
 * 原始类型以及其数组类型
 */
export declare type Primitive = string | number | boolean | [string] | [number] | [boolean];
/**
 * 属性全部为简单类型的对象
 */
export declare type Simple = {
    [propName: string]: Primitive;
};
/**
 * 类似 JSON 一样, 属性以及子属性全部为简单类型
 */
export declare type Json = {
    [propName: string]: Primitive | Json;
};
export declare type FormBlob = {
    [propName: string]: string | Blob;
};
export declare type PreRequest<D, PV, P> = (
    requestData: AxiosClientRequestData<D, PV, P>
) => boolean;
export declare type OnThen<D, PV, P> = (
    requestData: AxiosClientRequestData<D, PV, P>,
    response: AxiosResponse
) => void;
export declare type OnCatch<D, PV, P> = (
    requestData: AxiosClientRequestData<D, PV, P>,
    error: AxiosResponse
) => void;
export interface Handler<D, PV, P> {
    /**
     * 请求之前的处理，返回 false 则取消请求
     */
    preRequest?: PreRequest<D, PV, P>;
    /**
     * 响应成功 then 的处理
     */
    onThen?: OnThen<D, PV, P>;
    /**
     * 响应失败 catch 的处理, 不处理取消请求产生的错误
     */
    onCatch?: OnCatch<D, PV, P>;
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
export interface AxiosClientRequestConfig<D, PV, P> extends AxiosRequestConfig {
    pathVariables?: PV;
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
    dataSerializer?: (data: D) => string | FormData;
    paramsSerializer?: (params: P) => string;
    /**
     * 请求之前的处理，返回 false 则取消请求
     */
    preRequest?: PreRequest<D, PV, P>;
    /**
     * 响应成功 then 的处理
     */
    onThen?: OnThen<D, PV, P>;
    /**
     * 响应失败 catch 的处理, 不处理取消请求产生的错误
     */
    onCatch?: OnCatch<D, PV, P>;
}
export interface AxiosClientRequestData<D, PV, P> {
    pathVariables?: PV;
    params?: P;
    data?: D;
    attach?: any;
}
