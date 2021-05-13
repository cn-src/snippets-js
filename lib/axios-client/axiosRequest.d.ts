import { AxiosInstance } from "axios";
import { AxiosClientRequestConfig, AxiosClientRequestData } from "./AxiosClient";
export default function axiosRequest<D, PV, P>(
    _axios: AxiosInstance,
    _config: AxiosClientRequestConfig<D, PV, P>,
    requestData?: AxiosClientRequestData<D, PV, P>
): Promise<any>;
