import { AxiosStatic } from "axios";
/**
 * 根据 axios 创建一个新的 AxiosClient
 */
declare function AxiosClient(axios: AxiosStatic): {
    /**
     * GET 请求
     */
    get(url: string): (params?: any, pathVariables?: any) => Promise<any>;
    /**
     * POST 请求
     */
    post(url: string): (data?: any, pathVariables?: any) => Promise<any>;
    /**
     * POST 请求，form 表单格式参数
     */
    postForm(url: string): (data: any, pathVariables?: any) => Promise<any>;
    /**
     * POST 请求，formData 表单格式参数，文件上传
     */
    postFormData(url: string): (data: any, pathVariables?: any) => Promise<any>;
};
export default AxiosClient;
