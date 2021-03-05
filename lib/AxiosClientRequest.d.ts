import { AxiosInstance } from "axios";
import { AxiosClientRequestConfig } from "./AxiosClient";
export default class AxiosClientRequest<D, PV, P> {
    private readonly axios;
    private readonly config;
    private _pathParams?;
    private _params?;
    private _data?;
    private _append?;
    constructor(axios: AxiosInstance, config: AxiosClientRequestConfig<D, PV, P>);
    pathParams(pathParams: PV): AxiosClientRequest<D, PV, P>;
    data(data: D): AxiosClientRequest<D, PV, P>;
    params(params: P): AxiosClientRequest<D, PV, P>;
    append(append: any): this;
    fetchByPathParams(pathParams: PV): Promise<any>;
    fetchByParams(params: P): Promise<any>;
    fetchByData(data: D): Promise<any>;
    fetch(): Promise<any>;
}
