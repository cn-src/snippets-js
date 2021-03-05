import axios, { AxiosInstance } from "axios";

import {
    AxiosClientRequestConfig,
    AxiosClientRequestData,
    pathRender,
    searchParams
} from "./AxiosClient";

import isAxiosCancel from "axios/lib/cancel/isCancel";
import notEmptyObject from "../assert/notEmptyObject";

export default class AxiosClientRequest<D, PV, P> {
    private readonly axios: AxiosInstance;
    private readonly config: AxiosClientRequestConfig<D, PV, P>;

    private _pathParams?: PV;
    private _params?: P;
    private _data?: D;
    private _append?: any;

    constructor(axios: AxiosInstance, config: AxiosClientRequestConfig<D, PV, P>) {
        this.axios = axios;
        this.config = Object.assign({}, config);
    }

    /**
     * 设置路径参数
     *
     * @param pathParams 路径参数
     */
    pathParams(pathParams: PV): AxiosClientRequest<D, PV, P> {
        this._pathParams = notEmptyObject(pathParams);
        return this;
    }

    /**
     * 设置 http body 参数
     *
     * @param data body 参数
     */
    data(data: D): AxiosClientRequest<D, PV, P> {
        this._data = notEmptyObject(data);
        return this;
    }

    /**
     * 设置查询参数
     *
     * @param params 查询参数
     */
    params(params: P): AxiosClientRequest<D, PV, P> {
        this._params = notEmptyObject(params);
        return this;
    }

    /**
     * 附加参数, 例如：附加 ui 组件对象，用于 preRequest 回调中用于确认对话框。
     *
     * 大多数情况下应该应用于 AxiosClient 的统一配置中，比如 onDelete 的全局删除确认操作。
     *
     * @param append 附加对象，需要是一个 object 类型
     */
    append(append: any) {
        this._append = notEmptyObject(append);
        return this;
    }

    async fetchByPathParams(pathParams: PV) {
        return this.pathParams(pathParams).fetch();
    }

    async fetchByParams(params: P) {
        return this.params(params).fetch();
    }

    async fetchByData(data: D) {
        return this.data(data).fetch();
    }

    async fetch() {
        const requestData: AxiosClientRequestData<D, PV, P> = this._append || {};
        requestData.pathParams = this._pathParams;
        requestData.params = this._params;
        requestData.data = this._data;
        const isCancel = this.config.preRequest?.(requestData) === false;
        if (isCancel) {
            throw new axios.Cancel(`Cancel Request: ${this.config.method} ${this.config.url}`);
        }

        if (this._data && this.config.dataSerializer) {
            this.config.data = this.config.dataSerializer(this._data) as any;
        }
        this.config.url = pathRender(<string>this.config.url, requestData?.pathParams);
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
