import stringify from "./qs/stringify";
/**
 * 根据 axios 创建一个新的 AxiosClient
 */
export default class AxiosClient {
  constructor(axios, configuration) {
    this.axios = axios;
    this.configuration = configuration;
  }
  request(url, method, handler, dataSerializer) {
    const __axios = this.axios;
    const __configuration = this.configuration;
    return async function (data, pathVariables) {
      let params;
      if ("GET" === method) {
        params = data;
        data = undefined;
      }
      const isNext = handler?.beforeRequest?.(data);
      if (dataSerializer && data) {
        data = dataSerializer(data);
      }
      if (!isNext) {
        return async function () {
          // empty
        };
      }
      const promise = await __axios.request({
        url: pathRender(url, pathVariables),
        method,
        params,
        data,
      });
      handler?.afterResponse?.(promise);
      return __configuration?.extractData === false ? promise : promise.data;
    };
  }
  /**
   * GET 请求
   */
  get(url, handler) {
    return this.request(
      url,
      "GET",
      handler || {
        beforeRequest: this.configuration?.beforeGet,
        afterResponse: this.configuration?.afterGet,
      }
    );
  }
  /**
   * POST 请求
   */
  post(url, handler) {
    return this.request(
      url,
      "POST",
      handler || {
        beforeRequest: this.configuration?.beforePost,
        afterResponse: this.configuration?.afterPost,
      }
    );
  }
  /**
   * POST 请求, Content-Type 为 application/x-www-form-urlencoded
   */
  postForm(url, handler) {
    return this.request(
      url,
      "POST",
      handler || {
        beforeRequest: this.configuration?.beforePost,
        afterResponse: this.configuration?.afterPost,
      },
      stringify
    );
  }
  /**
   * POST 请求, Content-Type 为 multipart/form-data
   */
  postFormData(url, handler) {
    return this.request(
      url,
      "POST",
      handler || {
        beforeRequest: this.configuration?.beforePost,
        afterResponse: this.configuration?.afterPost,
      },
      formDataSerializer
    );
  }
  /**
   * PUT 请求
   */
  put(url, handler) {
    return this.request(
      url,
      "put",
      handler || {
        beforeRequest: this.configuration?.beforePut,
        afterResponse: this.configuration?.afterPut,
      }
    );
  }
  /**
   * DELETE 请求
   */
  delete(url, handler) {
    return this.request(
      url,
      "delete",
      handler || {
        beforeRequest: this.configuration?.beforeDelete,
        afterResponse: this.configuration?.afterDelete,
      }
    );
  }
}
export function formDataSerializer(data) {
  // eslint-disable-next-line no-undef
  const formData = new FormData();
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      formData.append(key, data[key]);
    }
  }
  return formData;
}
/**
 * 路径变量解析
 */
export function pathRender(path, pathVariables) {
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
