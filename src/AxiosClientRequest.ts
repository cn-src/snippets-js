import axios, { AxiosInstance } from "axios";

import {
    AxiosClientRequestConfig,
    AxiosClientRequestData,
    pathRender,
    searchParams
} from "./AxiosClient";

import isAxiosCancel from "axios/lib/cancel/isCancel";

export default class AxiosClientRequest<D, PV, P> {
    private readonly axios: AxiosInstance;
    private readonly config: AxiosClientRequestConfig<D, PV, P>;

    private _pathParams?: PV;
    private _params?: P;
    private _data?: D;

    constructor(axios: AxiosInstance, config: AxiosClientRequestConfig<D, PV, P>) {
        this.axios = axios;
        this.config = config;
    }

    pathParams(pathParams: PV): AxiosClientRequest<D, PV, P> {
        this._pathParams = pathParams;
        return this;
    }

    data(data: D): AxiosClientRequest<D, PV, P> {
        this._data = data;
        return this;
    }

    params(params: P): AxiosClientRequest<D, PV, P> {
        this._params = params;
        return this;
    }

    async fetchByParams(params: P) {
        this._params = params;
        return this.fetch();
    }

    async fetchByData(data: D) {
        this._data = data;
        return this.fetch();
    }

    async fetchByPathParams(pathParams: PV) {
        this._pathParams = pathParams;
        return this.fetch();
    }

    async fetch() {
        const usedConfig = Object.assign({}, this.config);
        const requestData: AxiosClientRequestData<D, PV, P> = {
            pathParams: this._pathParams,
            params: this._params,
            data: this._data
        };
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
