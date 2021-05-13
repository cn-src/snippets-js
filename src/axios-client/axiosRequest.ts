import axios, { AxiosInstance } from "axios";
import pathRender from "./pathRender";
import searchParams from "./searchParams";
import { AxiosClientRequestConfig } from "./AxiosClient";

import isAxiosCancel from "axios/lib/cancel/isCancel";

export default async function axiosRequest<D, PV, P>(
    _axios: AxiosInstance,
    _config: AxiosClientRequestConfig<D, PV, P>
) {
    const isCancel = _config.preRequest?.(_config) === false;
    if (isCancel) {
        throw new axios.Cancel(`Cancel Request: ${_config.method} ${_config.url}`);
    }

    if (_config.data && _config.dataSerializer) {
        _config.data = _config.dataSerializer(_config.data) as any;
    }
    _config.url = pathRender(<string>_config.url, _config?.pathVariables);
    _config.params = searchParams(_config?.params);
    try {
        const promise = await _axios.request(_config);
        _config.onThen?.(_config, promise);
        return _config.extractData === false ? promise : promise.data;
    } catch (e) {
        if (isAxiosCancel(e)) {
            throw e;
        }
        _config.onCatch?.(_config, e);
        throw _config.extractCatchData === true && e.response ? e.response.data : e;
    }
}
