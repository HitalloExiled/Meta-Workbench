import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";

import template from "index.html";
import style    from "index.scss";

@component("data-header", template, style)
export class Header extends CustomElement
{    
    public get bound(): string
    {
        return super.getAttribute("bound") || "";
    }
    
    public set bound(value: string)
    {
        super.setAttribute("bound", value);
    }

	public get header(): string
    {
		return super.getAttribute("header") || "";
	}

	public set header(value: string)
    {
        super.setAttribute("header", value);
	}

    public constructor()
    {
        super();
    }
}