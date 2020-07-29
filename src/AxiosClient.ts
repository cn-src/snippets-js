import { AxiosInstance, Method } from "axios";
import stringify from "./qs/stringify";

export interface AxiosClientConfiguration {
  /**
   * 是否提取响应的 data 部分
   */
  extractData: boolean;
}

/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
  private readonly axios;
  private readonly configuration?;

  constructor(axios: AxiosInstance, configuration?: AxiosClientConfiguration) {
    this.axios = axios;
    this.configuration = configuration;
  }

  request<D, V>(
    url: string,
    method?: Method,
    dataSerializer?: (D) => string | FormData
  ) {
    const __axios = this.axios;
    const __configuration = this.configuration;
    return async function (data?: D, pathVariables?: V) {
      let params;
      if ("GET" === method) {
        params = data;
        data = undefined;
      }
      if (dataSerializer && data) {
        data = dataSerializer(data) as any;
      }
      const promise = await __axios.request({
        url: pathRender(url, pathVariables),
        method,
        params,
        data,
      });
      return __configuration?.extractData === true ? promise.data : promise;
    };
  }

  /**
   * GET 请求
   */
  get<P = Simple, V = Simple>(url: string) {
    return this.request<P, V>(url, "GET");
  }

  /**
   * POST 请求
   */
  post<D = Json, V = Simple>(url: string) {
    return this.request<D, V>(url, "POST");
  }

  /**
   * POST 请求，Content-Type 为 application/x-www-form-urlencoded
   */
  postForm<D = Simple, V = Simple>(url: string) {
    return this.request<D, V>(url, "POST", stringify);
  }

  /**
   * POST 请求，Content-Type 为 multipart/form-data
   */
  postFormData<D = FormBlob, V = Simple>(url: string) {
    return this.request<D, V>(url, "POST", formDataSerializer);
  }

  /**
   * PUT 请求
   */
  put<D = Json, V = Simple>(url: string) {
    return this.request<D, V>(url, "put");
  }
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

/**
 * 属性全部为简单类型的对象
 */
export type Simple = { [propName: string]: string | number | boolean };

/**
 * 类似 JSON 一样，属性以及子属性全部为简单类型
 */
export type Json = {
  [propName: string]: string | number | boolean | Json;
};

export type FormBlob = { [propName: string]: string | Blob };
