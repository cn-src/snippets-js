import ArgumentError from "../ArgumentError";
/**
 * 参数必须不为 null
 */
function notNullOrUndefined(value, msg = "Argument must be not null or undefined") {
    if (null === value || value === undefined) {
        throw new ArgumentError(msg, notNullOrUndefined);
    }
    return value;
}
export default notNullOrUndefined;
