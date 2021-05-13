import { Simple } from "./AxiosClient";
/**
 * 路径变量解析
 */
export default function pathRender<T = Simple>(path: string, pathVariables?: T): string;
