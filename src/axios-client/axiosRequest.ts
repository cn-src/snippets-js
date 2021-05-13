import axios, { AxiosInstance } from "axios";
import pathRender from "./pathRender";
import searchParams from "./searchParams";
import { AxiosClientRequestConfig, AxiosClientRequestData } from "./AxiosClient";

import isAxiosCancel from "axios/lib/cancel/isCancel";

export default async function axiosRequest<D, PV, P>(_axios: AxiosInstance,
                                                     _config: AxiosClientRequestConfig<D, PV, P>,
                                                     requestData?: AxiosClientRequestData<D, PV, P>) {
    const config = Object.assign({}, _config);
    // config.pathVariables = requestData?.pathVariables;
    // config.data = requestData?.data;
    // config.params = requestData?.params;
    const isCancel = config.preRequest?.(requestData) === false;

    if (isCancel) {
        throw new axios.Cancel(`Cancel Request: ${config.method} ${config.url}`);
    }

    if (requestData?.data && config.dataSerializer) {
        config["data"] = config.dataSerializer(requestData?.data) as any;
    }
    config.url = pathRender(<string>config.url, requestData?.pathVariables);
    config["params"] = searchParams(requestData?.params);
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
