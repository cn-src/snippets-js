import axios, { AxiosInstance } from "axios";

import {
    AxiosClientRequestConfig,
    AxiosClientRequestData,
    pathRender,
    searchParams
} from "./AxiosClient";

import isAxiosCancel from "axios/lib/cancel/isCancel";
import notEmptyObject from "./assert/notEmptyObject";

export default class AxiosClientRequest<D, PV, P> {
    private readonly axios: AxiosInstance;
    private readonly config: AxiosClientRequestConfig<D, PV, P>;

    private _pathParams?: PV;
    private _params?: P;
    private _data?: D;
    private _append?: any;

    constructor(axios: AxiosInstance, config: AxiosClientRequestConfig<D, PV, P>) {
        this.axios = axios;
        this.config = config;
    }

    pathParams(pathParams: PV): AxiosClientRequest<D, PV, P> {
        this._pathParams = notEmptyObject(pathParams);
        return this;
    }

    data(data: D): AxiosClientRequest<D, PV, P> {
        this._data = notEmptyObject(data);
        return this;
    }

    params(params: P): AxiosClientRequest<D, PV, P> {
        this._params = notEmptyObject(params);
        return this;
    }

    append(append: any) {
        this._append = append;
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
        const usedConfig = Object.assign({}, this.config);
        const requestData: AxiosClientRequestData<D, PV, P> = this._append;
        requestData.pathParams = this._pathParams;
        requestData.params = this._params;
        requestData.data = this._data;
        const isCancel = usedConfig.preRequest?.(requestData) === false;
        if (isCancel) {
            throw new axios.Cancel(`Cancel Request: ${usedConfig.method} ${usedConfig.url}`);
        }

        if (this._data && usedConfig.dataSerializer) {
            usedConfig.data = usedConfig.dataSerializer(this._data) as any;
        }
        usedConfig.url = pathRender(<string>usedConfig.url, requestData?.pathParams);
        usedConfig.params = searchParams(requestData?.params);

        try {
            const promise = await this.axios.request(usedConfig);
            usedConfig.onThen?.(requestData, promise);
            return usedConfig.extractData === false ? promise : promise.data;
        } catch (e) {
            if (isAxiosCancel(e)) {
                throw e;
            }
            usedConfig.onCatch?.(requestData, e);
            throw usedConfig.extractCatchData === true && e.response ? e.response.data : e;
        }
    }
}
