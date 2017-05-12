import { CustomElement } from "@surface/core/custom-element";
import { component } from "@surface/core/decorators";

import template from "index.html";
import style    from "index.scss";

@component("data-column", template, style)
//@observe("header")
export class Column extends CustomElement
{
	public get header(): string
    {
		return super.getAttribute("header") || "";
	}

	public set header(value: string)
    {
        super.letAttribute("header", value);
	}

    public get content(): HTMLElement
    {
        return this.attach("*");
    }  

    public constructor()
    {
        super();
    }
}