import { AxiosStatic } from "axios";
import stringify from "./qs/stringify";

/**
 * 根据 axios 创建一个新的 AxiosClient
 */
function AxiosClient(axios: AxiosStatic) {
  return {
    /**
     * GET 请求
     */
    get(url: string) {
      return async function (params?: any, pathVariables?: any) {
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
    post(url: string) {
      return async function (data?: any, pathVariables?: any) {
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
    postForm(url: string) {
      return async function (data: any, pathVariables?: any) {
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
    postFormData(url: string) {
      return async function (data: any, pathVariables?: any) {
        // eslint-disable-next-line no-undef
        const formData = new FormData();
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            formData.append(key, data[key]);
          }
          data = formData;
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
function pathParse(path: string, pathVariables?: any) {
  let rs = path;
  if (pathVariables) {
    for (const key in pathVariables) {
      if (Object.prototype.hasOwnProperty.call(pathVariables, key)) {
        rs = path.replace(`{${key}}`, pathVariables[key]);
      }
    }
  }
  return rs;
}

export default AxiosClient;
