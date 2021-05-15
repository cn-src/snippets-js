declare type Parameter = {
    new (): FormData | URLSearchParams;
};
export default function paramConverter(parameter: Parameter, data?: any): any;
export {};
