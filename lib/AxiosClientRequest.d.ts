import { AxiosInstance } from "axios";
import { AxiosClientRequestConfig } from "./AxiosClient";
export default class AxiosClientRequest<PV, P, D> {
    private readonly axios;
    private readonly config;
    private _pathParams?;
    private _params?;
    private _data?;
    constructor(axios: AxiosInstance, config: AxiosClientRequestConfig<PV, P, D>);
    pathParams(pathParams: PV): AxiosClientRequest<PV, P, D>;
    data(data: D): AxiosClientRequest<PV, P, D>;
    params(params: P): AxiosClientRequest<PV, P, D>;
    fetch(): Promise<any>;
}
