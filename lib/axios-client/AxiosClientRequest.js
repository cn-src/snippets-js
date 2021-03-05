import axios from "axios";
import { pathRender, searchParams } from "./AxiosClient";
import isAxiosCancel from "axios/lib/cancel/isCancel";
import notEmptyObject from "../assert/notEmptyObject";
export default class AxiosClientRequest {
    constructor(axios, config) {
        this.axios = axios;
        this.config = Object.assign({}, config);
    }
    pathParams(pathParams) {
        this._pathParams = notEmptyObject(pathParams);
        return this;
    }
    data(data) {
        this._data = notEmptyObject(data);
        return this;
    }
    params(params) {
        this._params = notEmptyObject(params);
        return this;
    }
    append(append) {
        this._append = append;
        return this;
    }
    async fetchByPathParams(pathParams) {
        return this.pathParams(pathParams).fetch();
    }
    async fetchByParams(params) {
        return this.params(params).fetch();
    }
    async fetchByData(data) {
        return this.data(data).fetch();
    }
    async fetch() {
        const requestData = this._append || {};
        requestData.pathParams = this._pathParams;
        requestData.params = this._params;
        requestData.data = this._data;
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
