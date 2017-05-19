import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";
import { List }          from "@surface/core/enumerable/list";
import { Row }           from "@surface/components/data/row";

import template from "index.html";
import style    from "index.scss";

@component("data-row-group", template, style)
export class RowGroup extends CustomElement
{
    private _rows = super.attachAll<Row>("data-row");
    public get rows(): List<Row>
    {
        return this._rows;
    }

    public set rows(value: List<Row>)
    {
        this._rows = value;
    }

    public addRow(row: Row): void
    {
        this._rows.add(row);
        this.appendChild(row);
    }

    public removeRow(index: number): void
    {
        let row = this._rows.item(index);
        this._rows.remove(index);
        this.removeChild(row);
    }

    public constructor()
    {
        super();
    }
}