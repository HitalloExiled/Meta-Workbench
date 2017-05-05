import "@surface/components/action/menu-item";
import { MenuItem } from "@surface/components/action/menu-item";

import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";
import { List }          from "@surface/core/enumerable";

import template from "index.html";
import style    from "index.scss";

@component("action-menu", template, style)
export class Menu extends CustomElement
{    
    private _items: List<MenuItem> = super.attachAll<MenuItem>("action-menu-item");
    public get items(): List<MenuItem>
    {
        return this._items;
    }
}