import "@surface/components/action/menu-item";
import { MenuItem } from "@surface/components/action/menu-item";

import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";

import template from "index.html";
import style    from "index.scss";

@component("action-menu", template, style)
export class Menu extends CustomElement
{    
    private _items: Array<MenuItem> = super.attachAll<MenuItem>("action-menu-item");
    public get items(): Array<MenuItem>
    {
        return this._items;
    }
}