import ArgumentError from "../ArgumentError";

/**
 * 参数必须不为空，且类型为 string
 */
function notEmptyString(value: any, msg = "Argument must be string type and not empty") {
    if (null == value || typeof value !== "string" || value.length === 0) {
        throw new ArgumentError(msg, notEmptyString);
    }
    return value;
}

export default notEmptyString;
