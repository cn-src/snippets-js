import axios from "axios";
import { pathRender, searchParams } from "./AxiosClient";
import isAxiosCancel from "axios/lib/cancel/isCancel";
export default class AxiosClientRequest {
    constructor(axios, config) {
        this.axios = axios;
        this.config = config;
    }
    pathParams(pathParams) {
        this._pathParams = pathParams;
        return this;
    }
    data(data) {
        this._data = data;
        return this;
    }
    params(params) {
        this._params = params;
        return this;
    }
    async fetch() {
        const usedConfig = Object.assign({}, this.config);
        const requestData = {
            pathParams: this._pathParams,
            params: this._params,
            data: this._data,
        };
        const isCancel = usedConfig.preRequest?.(requestData) === false;
        if (isCancel) {
            throw new axios.Cancel(`Cancel Request: ${usedConfig.method} ${usedConfig.url}`);
        }
        if (this._data && usedConfig.dataSerializer) {
            usedConfig.data = usedConfig.dataSerializer(this._data);
        }
        usedConfig.url = pathRender(usedConfig.url, requestData?.pathParams);
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
