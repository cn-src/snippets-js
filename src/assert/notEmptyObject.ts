import ArgumentError from "../ArgumentError";

/**
 * 参数必须不为空，且类型为 string
 */
function notEmptyObject(value: any, msg?: string) {
    if (null == value || typeof value !== "object") {
        throw new ArgumentError(msg, notEmptyObject);
    }
}

export default notEmptyObject;
