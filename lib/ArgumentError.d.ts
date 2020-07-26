/**
 * 参数错误
 */
declare class ArgumentError extends Error {
    constructor(message?: any, stackStartFn?: any);
}
export default ArgumentError;
