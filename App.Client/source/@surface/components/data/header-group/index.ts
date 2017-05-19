import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";
import { List }          from "@surface/core/enumerable/list";
import { Header }        from "@surface/components/data/header";

import template from "index.html";
import style    from "index.scss";

@component("data-header-group", template, style)
export class HeaderGroup extends CustomElement
{
    private _columns = super.attachAll<Header>("data-header");

    public get columns(): List<Header>
    {
        return this._columns;
    }

    public set columns(value: List<Header>)
    {
        this._columns.forEach(x => this.removeChild(x));
        value.forEach(x => this.appendChild(x));
        this._columns = value;
    }

    public addColumn(column: Header): void
    {
        this._columns.add(column);
        this.appendChild(column);
    }

    public removeColumn(column: Header): void
    {
        this._columns.remove(column);
        this.removeChild(column);
    }

    public constructor()
    {
        super();
    }
}