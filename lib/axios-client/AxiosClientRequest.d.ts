import { AxiosInstance } from "axios";
import { AxiosClientRequestConfig } from "./AxiosClient";
export default class AxiosClientRequest<D, PV, P> {
    private readonly axios;
    private readonly config;
    private _pathVariables?;
    private _params?;
    private _data?;
    private _attach?;
    constructor(axios: AxiosInstance, config: AxiosClientRequestConfig<D, PV, P>);
    /**
     * 设置路径参数
     *
     * @param pathVariables 路径参数
     */
    pathVariables(pathVariables: PV): AxiosClientRequest<D, PV, P>;
    /**
     * 设置 http body 参数
     *
     * @param data body 参数
     */
    data(data: D): AxiosClientRequest<D, PV, P>;
    /**
     * 设置查询参数
     *
     * @param params 查询参数
     */
    params(params: P): AxiosClientRequest<D, PV, P>;
    /**
     * 附加参数, 例如：附加 ui 组件对象，用于 preRequest 回调中用于确认对话框。
     *
     * 大多数情况下应该应用于 AxiosClient 的统一配置中，比如 onDelete 的全局删除确认操作。
     *
     * @param attach 附加对象，需要是一个 object 类型
     */
    attach(attach: Record<string, unknown>): this;
    fetchByPathVariables(pathVariables: PV): Promise<any>;
    fetchByParams(params: P): Promise<any>;
    fetchByData(data: D): Promise<any>;
    fetch(dataOrParams?: D | P): Promise<any>;
}
