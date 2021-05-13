import ArgumentError from "../ArgumentError";
/**
 * 路径变量解析
 */
export default function pathRender(path, pathVariables) {
    let rs = path;
    if (pathVariables === null || pathVariables === undefined) {
        return pathVariables;
    }
    if (typeof pathVariables !== "object") {
        throw new ArgumentError("Argument must be 'object' type", pathRender);
    }
    for (const key in pathVariables) {
        if (!Object.prototype.hasOwnProperty.call(pathVariables, key)) {
            continue;
        }
        rs = rs.replace(`{${key}}`, "" + pathVariables[key]);
    }
    return rs;
}
