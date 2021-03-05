import ArgumentError from "../ArgumentError";

/**
 * 参数必须不为 null
 */
function notNull(value: any, msg?: string) {
    if (null == value) {
        throw new ArgumentError(msg, notNull);
    }
    return value;
}

export default notNull;
