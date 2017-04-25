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
        return super.getAttribute("active") == "true";
    }

    public set active(value: boolean)
    {
        super.letAttribute("active", value ? "true" : "false");
    }
    public get label(): string
    {
        return super.getAttribute("label") || "";
    }

    public set label(value: string)
    {
        super.letAttribute("label", value);
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
        return super.getAttribute("action") || "";
    }

    public set action(value: string)
    {
        super.letAttribute("action", value);
    }
}