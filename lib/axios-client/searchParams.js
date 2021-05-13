export default function searchParams(params) {
    if (!params || params instanceof URLSearchParams) {
        return params;
    }
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(function (key) {
        if (Array.isArray(params[key])) {
            Object.keys(params[key]).forEach(function (subKey) {
                searchParams.append(key, params[key][subKey]);
            });
        } else {
            searchParams.append(key, params[key]);
        }
    });
    return searchParams;
}
