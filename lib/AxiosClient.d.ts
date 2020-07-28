import { AxiosStatic } from "axios";
/**
 * 属性全部为简单类型的对象
 */
declare type SIMPLE_OBJECT = {
  [propName: string]: string | number | boolean;
};
/**
 * 类似 JSON 一样，属性以及子属性全部为简单类型
 */
declare type JSON_OBJECT = {
  [propName: string]: string | number | boolean | JSON_OBJECT;
};
/**
 * 根据 axios 创建一个新的 AxiosClient
 */
declare function AxiosClient(
  axios: AxiosStatic
): {
  /**
   * GET 请求
   */
  get<P = SIMPLE_OBJECT, V = SIMPLE_OBJECT>(
    url: string
  ): (params?: P | undefined, pathVariables?: V | undefined) => Promise<any>;
  /**
   * POST 请求
   */
  post<D = JSON_OBJECT, V_1 = SIMPLE_OBJECT>(
    url: string
  ): (data?: D | undefined, pathVariables?: V_1 | undefined) => Promise<any>;
  /**
   * POST 请求，Content-Type 为 application/x-www-form-urlencoded
   */
  postForm<D_1 = SIMPLE_OBJECT, V_2 = SIMPLE_OBJECT>(
    url: string
  ): (data: D_1, pathVariables?: V_2 | undefined) => Promise<any>;
  /**
   * POST 请求，Content-Type 为 multipart/form-data
   */
  postFormData<
    D_2 = {
      [propName: string]: string | Blob;
    },
    V_3 = SIMPLE_OBJECT
  >(
    url: string
  ): (data: D_2, pathVariables?: V_3 | undefined) => Promise<any>;
};
export default AxiosClient;
