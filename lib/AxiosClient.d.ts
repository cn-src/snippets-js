import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AxiosClientRequest from "./AxiosClientRequest";
/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
    private readonly axios;
    private readonly config?;
    constructor(axios: AxiosInstance, config?: AxiosClientConfig);
    request<PV, P, D>(config: AxiosClientRequestConfig<PV, P, D>): AxiosClientRequest<PV, P, D>;
    /**
     * GET 请求
     */
    get<PV = Simple, P = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<PV, P, never>
    ): AxiosClientRequest<PV, P, never>;
    /**
     * POST 请求
     */
    post<PV = Simple, D = Json>(
        url: string,
        config?: AxiosClientRequestConfig<PV, never, D>
    ): AxiosClientRequest<PV, never, D>;
    /**
     * POST 请求, Content-Type 为 application/x-www-form-urlencoded
     */
    postForm<PV = Simple, D = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<PV, never, D>
    ): AxiosClientRequest<PV, never, D>;
    /**
     * POST 请求, Content-Type 为 multipart/form-data
     */
    postFormData<PV = Simple, D = FormBlob>(
        url: string,
        config?: AxiosClientRequestConfig<PV, never, D>
    ): AxiosClientRequest<PV, never, D>;
    /**
     * PUT 请求
     */
    put<PV = Simple, D = Json>(
        url: string,
        config?: AxiosClientRequestConfig<PV, never, D>
    ): AxiosClientRequest<PV, never, D>;
    /**
     * PATCH 请求
     */
    patch<PV = Simple, D = Json>(
        url: string,
        config?: AxiosClientRequestConfig<PV, never, D>
    ): AxiosClientRequest<PV, never, D>;
    /**
     * DELETE 请求
     */
    delete<PV = Simple, P = Simple>(
        url: string,
        config?: AxiosClientRequestConfig<PV, P, never>
    ): AxiosClientRequest<PV, P, never>;
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
export declare function mergeConfig<PV, P, D>(
    clientConfig?: AxiosClientConfig,
    methodConfig?: AxiosClientRequestConfig<PV, P, D>
): AxiosClientRequestConfig<PV, P, D>;
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
export declare type PreRequest<PV, P, D> = (
    requestData: AxiosClientRequestData<PV, P, D>
) => boolean;
export declare type OnThen<PV, P, D> = (
    requestData: AxiosClientRequestData<PV, P, D>,
    response: AxiosResponse
) => void;
export declare type OnCatch<PV, P, D> = (
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
