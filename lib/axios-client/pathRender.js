/**
 * 路径变量解析
 */
export default function pathRender(path, pathVariables) {
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
