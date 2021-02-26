import axios, { AxiosInstance } from "axios";

import {
    AxiosClientRequestConfig,
    AxiosClientRequestData,
    pathRender, searchParams
} from "./AxiosClient";

import isAxiosCancel from "axios/lib/cancel/isCancel";

export default class AxiosClientRequest<PV, P, D> {
    private readonly axios: AxiosInstance;
    private readonly config: AxiosClientRequestConfig<PV, P, D>;

    private _pathParams?: PV;
    private _params?: P;
    private _data?: D;

    constructor(axios: AxiosInstance, config: AxiosClientRequestConfig<PV, P, D>) {
        this.axios = axios;
        this.config = config;
    }

    pathParams(pathParams: PV): AxiosClientRequest<PV, P, D> {
        this._pathParams = pathParams;
        return this;
    }

    data(data: D): AxiosClientRequest<PV, P, D> {
        this._data = data;
        return this;
    }

    params(params: P): AxiosClientRequest<PV, P, D> {
        this._params = params;
        return this;
    }

    async fetch() {
        const usedConfig = Object.assign({}, this.config);
        const requestData: AxiosClientRequestData<PV, P, D> = {
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