import ArgumentError from "../ArgumentError";

/**
 * 参数必须不为空，且类型为 string
 */
function notEmptyString(object: any, msg?: string) {
    if (null == object || typeof object !== "string" || object.length === 0) {
        throw new ArgumentError(msg, notEmptyString);
    }
}

export default notEmptyString;
