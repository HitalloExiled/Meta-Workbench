import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";

import template from "index.html";

@component("data-column", template)
export class Column extends CustomElement
{
    public static get observedAttributes(): Array<string>
    {
        return [];
    }

    public constructor()
    {
        super();
    }

    public connectedCallback()
    { }

    public disconnectedCallback()
    { }

    public attributeChangedCallback(attributeName: string, oldValue: string, newValue: string, namespace: string)
    { }

    public adoptedCallback(oldDocument: Document, newDocument: Document)
    { }
}