import {
  AxiosAdapter,
  AxiosBasicCredentials,
  AxiosInstance,
  AxiosProxyConfig,
  AxiosTransformer,
  CancelToken,
  Method,
  ResponseType,
} from "axios";
import stringify from "./qs/stringify";

/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
  private readonly axios: AxiosInstance;
  private readonly configuration?: AxiosClientConfiguration;

  constructor(axios: AxiosInstance, configuration?: AxiosClientConfiguration) {
    this.axios = axios;
    this.configuration = configuration;
  }

  request<P, D, V>(config: AxiosClientRequestConfig) {
    const __axios: AxiosInstance = this.axios;
    const __configuration = this.configuration;
    return async function (data?: AxiosClientRequestData<P, D, V>) {
      const isNext = config.handler?.beforeRequest?.(data);
      if (data?.data && config.dataSerializer) {
        data.data = config.dataSerializer(data) as any;
      }
      if (!isNext) {
        return async function () {
          // empty
        };
      }
      config.url = pathRender(config.url, data?.pathVariables);
      const promise = await __axios.request(config);
      config.handler?.afterResponse?.(promise);
      return __configuration?.extractData === false ? promise : promise.data;
    };
  }

  /**
   * GET 请求
   */
  get<P = Simple, V = Simple>(url: string, handler?: Handler) {
    return this.request<P, never, V>({
      url,
      method: "get",
      handler: handler || {
        beforeRequest: this.configuration?.beforeGet,
        afterResponse: this.configuration?.afterGet,
      },
    });
  }

  /**
   * POST 请求
   */
  post<D = Json, V = Simple>(url: string, handler?: Handler) {
    return this.request<never, D, V>({
      url,
      method: "post",
      handler: handler || {
        beforeRequest: this.configuration?.beforePost,
        afterResponse: this.configuration?.afterPost,
      },
    });
  }

  /**
   * POST 请求, Content-Type 为 application/x-www-form-urlencoded
   */
  postForm<D = Simple, V = Simple>(url: string, handler?: Handler) {
    return this.request<never, D, V>({
      url,
      method: "post",
      dataSerializer: stringify,
      handler: handler || {
        beforeRequest: this.configuration?.beforePost,
        afterResponse: this.configuration?.afterPost,
      },
    });
  }

  /**
   * POST 请求, Content-Type 为 multipart/form-data
   */
  postFormData<D = FormBlob, V = Simple>(url: string, handler?: Handler) {
    return this.request<never, D, V>({
      url,
      method: "post",
      dataSerializer: formDataSerializer,
      handler: handler || {
        beforeRequest: this.configuration?.beforePost,
        afterResponse: this.configuration?.afterPost,
      },
    });
  }

  /**
   * PUT 请求
   */
  put<D = Json, V = Simple>(url: string, handler?: Handler) {
    return this.request<never, D, V>({
      url,
      method: "put",
      handler: handler || {
        beforeRequest: this.configuration?.beforePut,
        afterResponse: this.configuration?.afterPut,
      },
    });
  }

  /**
   * DELETE 请求
   */
  delete<P = Simple, V = Simple>(url: string, handler?: Handler) {
    return this.request<P, never, V>({
      url,
      method: "delete",
      handler: handler || {
        beforeRequest: this.configuration?.beforeDelete,
        afterResponse: this.configuration?.afterDelete,
      },
    });
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
 * 类似 JSON 一样, 属性以及子属性全部为简单类型
 */
export type Json = {
  [propName: string]: string | number | boolean | Json;
};

export type FormBlob = { [propName: string]: string | Blob };

export interface AxiosClientConfiguration {
  /**
   * 是否提取响应的 data 部分, 默认提取
   */
  extractData?: boolean;

  headers?: any;

  /**
   * 执行 GET 之前的处理, 返回 false 则不进行请求
   */
  beforeGet?: (any) => boolean;

  /**
   * 执行 GET 之后的处理
   */
  afterGet?: (AxiosResponse) => void;

  /**
   * 执行 POST 之前的处理, 返回 false 则不进行请求
   */
  beforePost?: (any) => boolean;

  /**
   * 执行 POST 之后的处理
   */
  afterPost?: (AxiosResponse) => void;

  /**
   * 执行 PUT 之前的处理, 返回 false 则不进行请求
   */
  beforePut?: (any) => boolean;

  /**
   * 执行 PUT 之后的处理
   */
  afterPut?: (AxiosResponse) => void;

  /**
   * 执行 DELETE 之前的处理, 返回 false 则不进行请求
   */
  beforeDelete?: (any) => boolean;

  /**
   * 执行 DELETE 之后的处理
   */
  afterDelete?: (AxiosResponse) => void;
}

export interface Handler {
  beforeRequest?: (any) => boolean;
  afterResponse?: (AxiosResponse) => void;
}

export interface AxiosClientRequestConfig {
  handler: Handler;
  url: string;
  method?: Method;
  baseURL?: string;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  headers?: any;
  // params?: any;
  paramsSerializer?: (params: any) => string;
  dataSerializer?: (params: any) => string | FormData;
  // data?: any;
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

export interface AxiosClientRequestData<P, D, V> {
  pathVariables?: V;
  params?: P;
  data?: D;
}
