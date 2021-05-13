import { Simple } from "./AxiosClient";

/**
 * 路径变量解析
 */
export default function pathRender<T = Simple>(path: string, pathVariables?: T) {
    let rs = path;
    if (pathVariables) {
        for (const key in pathVariables) {
            if (Object.prototype.hasOwnProperty.call(pathVariables, key)) {
                rs = rs.replace(`{${key}}`, "" + pathVariables[key]);
            }
        }
    }
    return rs;
}
