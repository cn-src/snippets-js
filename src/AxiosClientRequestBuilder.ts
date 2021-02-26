import axios, { AxiosInstance } from "axios";

import {
    AxiosClientRequestConfig,
    AxiosClientRequestData,
    OnCatch, OnThen, pathRender, PreRequest, searchParams
} from "./AxiosClient";

import isAxiosCancel from "axios/lib/cancel/isCancel";

export default class AxiosClientRequestBuilder<PV, P, D> {
    private readonly axios: AxiosInstance;
    private readonly config: AxiosClientRequestConfig<PV, P, D>;

    private _pathParams: any;
    private _params: any;
    private _data: any;

    /**
     * 请求之前的处理，返回 false 则取消请求
     */
    private _preRequest?: PreRequest<PV, P, D>;

    /**
     * 响应成功 then 的处理
     */
    private _onThen?: OnThen<PV, P, D>;

    /**
     * 响应失败 catch 的处理, 不处理取消请求产生的错误
     */
    private _onCatch?: OnCatch<PV, P, D>;

    constructor(axios: AxiosInstance, config: AxiosClientRequestConfig<PV, P, D>) {
        this.axios = axios;
        this.config = config;
    }

    pathParams(pathParams: PV): AxiosClientRequestBuilder<PV, P, D> {
        this._pathParams = pathParams;
        return this;
    }

    data(data: D): AxiosClientRequestBuilder<PV, P, D> {
        this._data = data;
        return this;
    }

    params(params: P): AxiosClientRequestBuilder<PV, P, D> {
        this._params = params;
        return this;
    }

    preRequest(preRequest?: PreRequest<PV, P, D>) {
        this._preRequest = preRequest;
        return this;
    }

    onThen(onThen?: OnThen<PV, P, D>) {
        this._onThen = onThen;
        return this;
    }

    onCatch(onCatch?: OnCatch<PV, P, D>) {
        this._onCatch = onCatch;
        return this;
    }

    async fetch() {
        const usedConfig = Object.assign({}, this.config);
        const requestData: AxiosClientRequestData<PV, P, D> = {
            pathParams: this._pathParams,
            params: this._params,
            data: this._data
        };
        const isCancel = this._preRequest?.(requestData) === false;
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
            this._onThen?.(requestData, promise);
            return usedConfig.extractData === false ? promise : promise.data;
        } catch (e) {
            if (isAxiosCancel(e)) {
                throw e;
            }
            this._onCatch?.(requestData, e);
            throw usedConfig.extractCatchData === true && e.response ? e.response.data : e;
        }
    }
}