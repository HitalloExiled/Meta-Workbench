declare module '*.txt'
{
    var _: string;
    export default  _;
}

declare module '*.json'
{
    var _: string;
    export default  _;
}

declare module '*.html'
{
    var _: string;
    export default  _;
}

declare module '*.scss'
{
    var _: string;
    export default  _;
}

declare module '*.css'
{
    var _: string;
    export default  _;
}

declare interface Constructor<T> extends Function
{
    new():     T;
    new(...args: Array<any>);
    prototype: T;
}

declare type Nullable<T> = T|null|undefined;

declare namespace ShadyCSS
{
    function prepareTemplate(template: HTMLTemplateElement, name: string, element?: string);
    function styleElement(element: HTMLElement);
}