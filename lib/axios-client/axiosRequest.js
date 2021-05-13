import axios from "axios";
import pathRender from "./pathRender";
import paramConverter from "./paramConverter";
import isAxiosCancel from "axios/lib/cancel/isCancel";
export default async function axiosRequest(_axios, _config, requestData) {
    const config = Object.assign({}, _config);
    const isCancel = config.preRequest?.(requestData) === false;
    if (isCancel) {
        throw new axios.Cancel(`Cancel Request: ${config.method} ${config.url}`);
    }
    if (requestData?.pathVariables) {
        config.url = pathRender(config.url, requestData?.pathVariables);
    }
    if (requestData?.data && config.dataSerializer) {
        config["data"] = config.dataSerializer(requestData?.data);
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
