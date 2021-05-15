import ArgumentError from "../ArgumentError";

type Parameter = {
    new (): FormData | URLSearchParams;
};

export default function paramConverter(parameter: Parameter, data?: any) {
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
            value.forEach((it) => p.append(key, it as any));
        } else {
            p.append(key, value as any);
        }
    }
    return p;
}
