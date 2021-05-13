export default function formDataSerializer(data) {
    if (!data || data instanceof FormData) {
        return data;
    }
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (Array.isArray(value)) {
                value.forEach((it) => formData.append(key, it));
            } else {
                formData.append(key, value);
            }
        }
    }
    return formData;
}
