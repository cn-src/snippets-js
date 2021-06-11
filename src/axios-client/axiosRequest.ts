import axios, { AxiosInstance } from "axios";
import pathRender from "./pathRender";
import paramConverter from "./paramConverter";
import { AxiosClientRequestConfig, AxiosClientRequestData } from "./AxiosClient";

import isAxiosCancel from "axios/lib/cancel/isCancel";

export default async function axiosRequest<D, PV, P>(
    _axios: AxiosInstance,
    _config: AxiosClientRequestConfig<D, PV, P>,
    requestData?: AxiosClientRequestData<D, PV, P>
) {
    const config = Object.assign({}, _config);
    const isCancel = config.preRequest?.(requestData) === false;

    if (isCancel) {
        throw new axios.Cancel(`Cancel Request: ${config.method} ${config.url}`);
    }
    if (requestData?.pathVariables) {
        config.url = pathRender(<string>config.url, requestData?.pathVariables);
    }
    if (requestData?.data) {
        config["data"] = config.dataSerializer ? config.dataSerializer(requestData?.data)
            : (requestData?.data as any);
    }
    if (requestData?.params) {
        config["params"] = paramConverter(URLSearchParams, requestData?.params);
    }
    try {
        const promise = await _axios.request(config);
        config.onThen?.(requestData, promise);
        return config.extractData === false ? promise : promise.data;
    } catch (e) {
        if (isAxiosCancel(e)) {
            throw e;
        }
        config.onCatch?.(config, e);
        throw config.extractCatchData === true && e.response ? e.response.data : e;
    }
}
