import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";
import { List }          from "@surface/core/enumerable/list";
import { Column }        from "@surface/components/data/column";

import template from "index.html";
import style    from "index.scss";

@component("data-row", template, style)
export class Row extends CustomElement
{
    private _columns: List<Column> = new List<Column>();

    public set columns(value: List<Column>)
    {
        this._columns.forEach(x => this.removeChild(x));
        value.forEach(x => this.appendChild(x));
        this._columns = value;
    }

    public addColumn(column: Column): void
    {
        this._columns.add(column);
        this.appendChild(column);
    }

    public removeColumn(column: Column): void
    {
        this._columns.remove(column);
        this.removeChild(column);
    }

    public constructor()
    {
        super();
    }
}