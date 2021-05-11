import axios from "axios";
import { pathRender, searchParams } from "./AxiosClient";
import isAxiosCancel from "axios/lib/cancel/isCancel";
import mustObject from "../assert/mustObject";
export default class AxiosClientRequest {
    constructor(axios, config) {
        this.axios = axios;
        this.config = Object.assign({}, config);
    }
    /**
     * 设置路径参数
     *
     * @param pathVariables 路径参数
     */
    pathVariables(pathVariables) {
        this._pathVariables = mustObject(pathVariables);
        return this;
    }
    /**
     * 设置 http body 参数
     *
     * @param data body 参数
     */
    data(data) {
        this._data = mustObject(data);
        return this;
    }
    /**
     * 设置查询参数
     *
     * @param params 查询参数
     */
    params(params) {
        this._params = mustObject(params);
        return this;
    }
    /**
     * 附加参数, 例如：附加 ui 组件对象，用于 preRequest 回调中用于确认对话框。
     *
     * 大多数情况下应该应用于 AxiosClient 的统一配置中，比如 onDelete 的全局删除确认操作。
     *
     * @param attach 附加对象，需要是一个 object 类型
     */
    attach(attach) {
        this._attach = mustObject(attach);
        return this;
    }
    async fetchByPathVariables(pathVariables) {
        return this.pathVariables(pathVariables).fetch();
    }
    async fetchByParams(params) {
        return this.params(params).fetch();
    }
    async fetchByData(data) {
        return this.data(data).fetch();
    }
    async fetch(dataOrParams) {
        dataOrParams = mustObject(dataOrParams);
        const requestData = this._attach || {};
        requestData.pathParams = this._pathVariables;
        requestData.params = this._params;
        requestData.data = this._data;
        if (dataOrParams) {
            ["get", "patch", "delete"].includes(this.config.method?.toLowerCase())
                ? (requestData.params = dataOrParams)
                : (requestData.data = dataOrParams);
        }
        const isCancel = this.config.preRequest?.(requestData) === false;
        if (isCancel) {
            throw new axios.Cancel(`Cancel Request: ${this.config.method} ${this.config.url}`);
        }
        if (this._data && this.config.dataSerializer) {
            this.config.data = this.config.dataSerializer(this._data);
        }
        this.config.url = pathRender(this.config.url, requestData?.pathParams);
        this.config.params = searchParams(requestData?.params);
        try {
            const promise = await this.axios.request(this.config);
            this.config.onThen?.(requestData, promise);
            return this.config.extractData === false ? promise : promise.data;
        } catch (e) {
            if (isAxiosCancel(e)) {
                throw e;
            }
            this.config.onCatch?.(requestData, e);
            throw this.config.extractCatchData === true && e.response ? e.response.data : e;
        }
    }
}
