/**
 * 参数错误
 */
class ArgumentError extends Error {
    constructor(message, stackStartFn) {
        super(message || "Invalid Argument");
        this.name = "ArgumentError";
        // 堆栈起始信息定位到指定函数
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, stackStartFn);
        }
        Object.setPrototypeOf(this, ArgumentError.prototype);
    }
}
export default ArgumentError;
