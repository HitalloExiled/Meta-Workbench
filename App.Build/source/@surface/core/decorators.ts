import { CustomElement } from "@surface/core/custom-element";

export function component(name: string, template?: string, style?: string, options?: ElementDefinitionOptions): ClassDecorator
{
    return (target: Constructor<CustomElement>) =>
    {
        if (template)
        {
            target.prototype.template = templateParse(template, style);
            
            if (window["ShadyCSS"])
                ShadyCSS.prepareTemplate(target.prototype.template, name, options && options.extends);
        }
        
        window.customElements.define(name, target, options);

        return target;
    }
}

export function view(name: string, template: string, style?: string, options?: ElementDefinitionOptions): ClassDecorator
{
    return (target: Constructor<CustomElement>) => component(name, template, style, options)(target);
}

export function observe(...attributes: Array<string>): ClassDecorator
{
    return (target: Constructor<CustomElement>) =>
    {
        Object.defineProperty(target, "observedAttributes", { get: () => attributes } );
    }
}

export function metadata(target: any, key: string)
{
    var t = Reflect.getMetadata("design:type", target, key);
    console.log(`${key} type: ${t.name}`);
}

function templateParse(template: string, style?: string): HTMLTemplateElement
{    
    let templateElement = new DOMParser()
        .parseFromString(template, "text/html")
        .querySelector("template") as HTMLTemplateElement;

    if (style)
    {
        let styleElement = document.createElement("style") as HTMLStyleElement;
        styleElement.innerHTML = style;
        templateElement.content.appendChild(styleElement);
    }

    return templateElement;
}