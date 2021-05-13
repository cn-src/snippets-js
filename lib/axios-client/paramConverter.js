import ArgumentError from "../ArgumentError";
export default function paramConverter(parameter, data) {
    if (data === null || data === undefined) {
        return data;
    }
    if (data instanceof parameter) {
        return data;
    }
    if (typeof data !== "object") {
        throw new ArgumentError("Argument must be 'object' type", paramConverter);
    }
    const p = new parameter();
    for (const key in data) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) {
            continue;
        }
        const value = data[key];
        if (Array.isArray(value)) {
            value.forEach((it) => p.append(key, it));
        } else {
            p.append(key, value);
        }
    }
    return p;
}
