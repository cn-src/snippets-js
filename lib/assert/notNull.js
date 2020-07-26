import ArgumentError from "../ArgumentError";
/**
 * 参数必须不为 null
 */
function notNull(object, msg) {
    if (null == object) {
        throw new ArgumentError(msg, notNull);
    }
}
export default notNull;
