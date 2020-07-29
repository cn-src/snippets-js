import { AxiosInstance, Method } from "axios";
export interface AxiosClientConfiguration {
  /**
   * 是否提取响应的 data 部分, 默认提取
   */
  extractData?: boolean;
  /**
   * 执行 GET 之前的处理, 返回 false 则不进行请求
   */
  beforeGet?: (any: any) => boolean;
  /**
   * 执行 GET 之后的处理
   */
  afterGet?: (AxiosResponse: any) => void;
  /**
   * 执行 POST 之前的处理, 返回 false 则不进行请求
   */
  beforePost?: (any: any) => boolean;
  /**
   * 执行 POST 之后的处理
   */
  afterPost?: (AxiosResponse: any) => void;
  /**
   * 执行 PUT 之前的处理, 返回 false 则不进行请求
   */
  beforePut?: (any: any) => boolean;
  /**
   * 执行 PUT 之后的处理
   */
  afterPut?: (AxiosResponse: any) => void;
  /**
   * 执行 DELETE 之前的处理, 返回 false 则不进行请求
   */
  beforeDelete?: (any: any) => boolean;
  /**
   * 执行 DELETE 之后的处理
   */
  afterDelete?: (AxiosResponse: any) => void;
}
export interface Handler {
  beforeRequest?: (any: any) => boolean;
  afterResponse?: (AxiosResponse: any) => void;
}
/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
  private readonly axios;
  private readonly configuration?;
  constructor(axios: AxiosInstance, configuration?: AxiosClientConfiguration);
  request<D, V>(
    url: string,
    method: Method,
    handler?: Handler,
    dataSerializer?: (D: any) => string | FormData
  ): (data?: D | undefined, pathVariables?: V | undefined) => Promise<any>;
  /**
   * GET 请求
   */
  get<P = Simple, V = Simple>(
    url: string,
    handler?: Handler
  ): (data?: P | undefined, pathVariables?: V | undefined) => Promise<any>;
  /**
   * POST 请求
   */
  post<D = Json, V = Simple>(
    url: string,
    handler?: Handler
  ): (data?: D | undefined, pathVariables?: V | undefined) => Promise<any>;
  /**
   * POST 请求, Content-Type 为 application/x-www-form-urlencoded
   */
  postForm<D = Simple, V = Simple>(
    url: string,
    handler?: Handler
  ): (data?: D | undefined, pathVariables?: V | undefined) => Promise<any>;
  /**
   * POST 请求, Content-Type 为 multipart/form-data
   */
  postFormData<D = FormBlob, V = Simple>(
    url: string,
    handler?: Handler
  ): (data?: D | undefined, pathVariables?: V | undefined) => Promise<any>;
  /**
   * PUT 请求
   */
  put<D = Json, V = Simple>(
    url: string,
    handler?: Handler
  ): (data?: D | undefined, pathVariables?: V | undefined) => Promise<any>;
  /**
   * DELETE 请求
   */
  delete<D = Json, V = Simple>(
    url: string,
    handler?: Handler
  ): (data?: D | undefined, pathVariables?: V | undefined) => Promise<any>;
}
export declare function formDataSerializer(data: any): FormData;
/**
 * 路径变量解析
 */
export declare function pathRender<T = Simple>(
  path: string,
  pathVariables?: T
): string;
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
