import stringify from "./qs/stringify";
/**
 * 根据 axios 创建一个新的 AxiosClient
 */
function AxiosClient(axios) {
    return {
        /**
         * GET 请求
         */
        get(url) {
            return async function (params, pathVariables) {
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
        post(url) {
            return async function (data, pathVariables) {
                const promise = await axios.request({
                    url: pathParse(url, pathVariables),
                    method: "POST",
                    data
                });
                return promise.data;
            };
        },
        /**
         * POST 请求，form 表单格式参数
         */
        postForm(url) {
            return async function (data, pathVariables) {
                const promise = await axios.request({
                    url: pathParse(url, pathVariables),
                    method: "POST",
                    data: stringify(data)
                });
                return promise.data;
            };
        },
        /**
         * POST 请求，formData 表单格式参数，文件上传
         */
        postFormData(url) {
            return async function (data, pathVariables) {
                const formData = new FormData();
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        formData.append(key, data[key]);
                    }
                    data = formData;
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
function pathParse(path, pathVariables) {
    let rs = path;
    if (pathVariables) {
        for (const key in pathVariables) {
            if (pathVariables.hasOwnProperty(key)) {
                rs = path.replace(`{${key}}`, pathVariables[key]);
            }
        }
    }
    return rs;
}
export default AxiosClient;
