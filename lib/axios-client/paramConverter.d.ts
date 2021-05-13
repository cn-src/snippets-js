declare type Parameter = {
    new (): FormData | URLSearchParams;
};
export default function paramConverter<T>(parameter: Parameter, data?: any): any;
export {};
