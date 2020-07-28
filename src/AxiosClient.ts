import { AxiosStatic } from "axios";
import stringify from "./qs/stringify";

/**
 * 属性全部为简单类型的对象
 */
type SIMPLE_OBJECT = { [propName: string]: string | number | boolean };

/**
 * 类似 JSON 一样，属性以及子属性全部为简单类型
 */
type JSON_OBJECT = {
  [propName: string]: string | number | boolean | JSON_OBJECT;
};

/**
 * 根据 axios 创建一个新的 AxiosClient
 */
function AxiosClient(axios: AxiosStatic) {
  return {
    /**
     * GET 请求
     */
    get<P = SIMPLE_OBJECT, V = SIMPLE_OBJECT>(url: string) {
      return async function (params?: P, pathVariables?: V) {
        const promise = await axios.request({
          url: pathParse(url, pathVariables),
          method: "GET",
          params,
        });
        return promise.data;
      };
    },
    /**
     * POST 请求
     */
    post<D = JSON_OBJECT, V = SIMPLE_OBJECT>(url: string) {
      return async function (data?: D, pathVariables?: V) {
        const promise = await axios.request({
          url: pathParse(url, pathVariables),
          method: "POST",
          data,
        });
        return promise.data;
      };
    },
    /**
     * POST 请求，Content-Type 为 application/x-www-form-urlencoded
     */
    postForm<D = SIMPLE_OBJECT, V = SIMPLE_OBJECT>(url: string) {
      return async function (data: D, pathVariables?: V) {
        const promise = await axios.request({
          url: pathParse(url, pathVariables),
          method: "POST",
          data: stringify(data),
        });
        return promise.data;
      };
    },
    /**
     * POST 请求，Content-Type 为 multipart/form-data
     */
    postFormData<D = { [propName: string]: string | Blob }, V = SIMPLE_OBJECT>(
      url: string
    ) {
      return async function (data: D, pathVariables?: V) {
        // eslint-disable-next-line no-undef
        const formData = new FormData();
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            formData.append(key, data[key] as any);
          }
        }
        const promise = await axios.request({
          url: pathParse(url, pathVariables),
          method: "POST",
          data: formData,
        });
        return promise.data;
      };
    },
  };
}

/**
 * 路径变量解析
 */
function pathParse<T = SIMPLE_OBJECT>(path: string, pathVariables?: T) {
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

export default AxiosClient;
