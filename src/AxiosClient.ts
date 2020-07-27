import { AxiosStatic } from "axios";
import stringify from "./qs/stringify";

/**
 * 属性全部为简单类型的对象
 */
type ST = { [propName: string]: string | number | boolean }

/**
 * 根据 axios 创建一个新的 AxiosClient
 */
function AxiosClient(axios: AxiosStatic) {

  return {
    /**
     * GET 请求
     */
    get<P extends ST, V extends ST>(url: string) {
      return async function(params?: P, pathVariables?: V) {
        const promise = await axios.request({
          url: pathParse(url, pathVariables),
          method: "GET",
          params
        });
        return promise.data;
      };
    },
    /**
     * POST 请求
     */
    post<D extends { [propName: string]: string | number | boolean | ST }, V extends ST>(url: string) {
      return async function(data?: D, pathVariables?: V) {
        const promise = await axios.request({
          url: pathParse(url, pathVariables),
          method: "POST",
          data
        });
        return promise.data;
      };
    },
    /**
     * POST 请求，Content-Type 为 application/x-www-form-urlencoded
     */
    postForm<D extends ST, V extends ST>(url: string) {
      return async function(data: D, pathVariables?: V) {
        const promise = await axios.request({
          url: pathParse(url, pathVariables),
          method: "POST",
          data: stringify(data)
        });
        return promise.data;
      };
    },
    /**
     * POST 请求，Content-Type 为 multipart/form-data
     */
    postFormData<D extends { [propName: string]: string | Blob }, V extends ST>(url: string) {
      return async function(data: D, pathVariables?: V) {
        // eslint-disable-next-line no-undef
        const formData = new FormData();
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            formData.append(key, data[key]);
          }
        }
        const promise = await axios.request({
          url: pathParse(url, pathVariables),
          method: "POST",
          data: formData
        });
        return promise.data;
      };
    }
  };

}

/**
 * 路径变量解析
 */
function pathParse(path: string, pathVariables?: ST) {
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
