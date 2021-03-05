import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosClientRequest from "./AxiosClientRequest";
/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
    private readonly axios;
    private _config?;
    constructor(axios: AxiosInstance, config?: AxiosClientConfig);
    request<D, PV, P>(config: AxiosClientRequestConfig<D, PV, P>): AxiosClientRequest<D, PV, P>;
    config(config?: AxiosClientConfig): this;
    /**
     * GET 请求
     */
    get<P = Simple, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<never, PV, P>
    ): AxiosClientRequest<never, PV, P>;
    /**
     * POST 请求
     */
    post<D = Json, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<D, PV, never>
    ): AxiosClientRequest<D, PV, never>;
    /**
     * POST 请求, Content-Type 为 application/x-www-form-urlencoded
     */
    postForm<D = Simple, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<D, PV, never>
    ): AxiosClientRequest<D, PV, never>;
    /**
     * POST 请求, Content-Type 为 multipart/form-data
     */
    postFormData<D = FormBlob, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<D, PV, never>
    ): AxiosClientRequest<D, PV, never>;
    /**
     * PUT 请求
     */
    put<D = Json, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<D, PV, never>
    ): AxiosClientRequest<D, PV, never>;
    /**
     * PATCH 请求
     */
    patch<D = Json, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<D, PV, never>
    ): AxiosClientRequest<D, PV, never>;
    /**
     * DELETE 请求
     */
    delete<P = Simple, PV = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<never, PV, P>
    ): AxiosClientRequest<never, PV, P>;
}
/**
 * 将对象字符串化成 application/x-www-form-urlencoded 所需的格式
 */
export declare function stringify(object: any): string;
export declare function searchParams(params: any): any;
export declare function formDataSerializer(data: any): FormData;
/**
 * 路径变量解析
 */
export declare function pathRender<T = Simple>(path: string, pathVariables?: T): string;
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
    pathParams?: PV;
    params?: P;
    data?: D;
    [prop: string]: any;
}
