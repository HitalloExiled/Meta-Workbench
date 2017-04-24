import { CustomElement }      from "@surface/core/custom-element";
import { component, observe } from "@surface/core/decorators";

import template from "index.html";
import style    from "index.scss";

@component("action-menu-item", template, style)
@observe("action", "label", "active")
export class MenuItem extends CustomElement
{
    public get active(): boolean
    {
        return this.getAttribute("active") == "true";
    }

    public set active(value: boolean)
    {
        this.setAttribute("active", value ? "true" : "false");
    }
        
    public get label(): string
    {
        return this.getAttribute("label") || "";
    }

    public set label(value: string)
    {
        this.setAttribute("label", value);
    }
    
    private _subMenuItems: Array<MenuItem>;
    public get subMenuItems(): Array<MenuItem>
    {
        return this._subMenuItems;
    }

    public set subMenuItems(value: Array<MenuItem>)
    {
        this._subMenuItems = value;
    }

    public get action(): string
    {
        return this.getAttribute("action") || "";
    }

    public set action(value: string)
    {
        this.setAttribute("action", value);
    }

    public attributeChangedCallback(attributeName: string, oldValue: string, newValue: string, namespace: string): void
    {
        super.attributeChangedCallback(attributeName, oldValue, newValue, namespace);
    }
}