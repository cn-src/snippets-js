import ArgumentError from "../ArgumentError";
/**
 * 参数必须不为空，且类型为 string
 */
function notEmptyObject(value, msg = "Argument must be object type and not null") {
    if (null == value || typeof value !== "object") {
        throw new ArgumentError(msg, notEmptyObject);
    }
    return value;
}
export default notEmptyObject;
