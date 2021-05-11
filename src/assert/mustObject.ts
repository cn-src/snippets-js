import ArgumentError from "../ArgumentError";

/**
 * 参数必须不为空，且类型为 string
 */
function mustObject(value: any, msg = "Argument must be object type") {
    if (null !== value && value !== undefined && typeof value !== "object") {
        throw new ArgumentError(msg, mustObject);
    }
    return value;
}

export default mustObject;
