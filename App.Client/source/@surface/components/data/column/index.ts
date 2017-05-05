import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";

import template from "index.html";

@component("data-column", template)
export class Column extends CustomElement
{
    public get content(): HTMLElement
    {
        return this.attachAll("*")
            .cast<HTMLSlotElement>()
            .where(x => true)
            .first();
    }  

    public constructor()
    {
        super();
    }
}