import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";
import { Row }           from "@surface/components/data/row";

import template from "index.html";

@component("data-grid", template)
export class Grid extends CustomElement
{
    private _rows: Array<Row>;
    public get rows(): Array<Row>
    {
        return this._rows;
    }

    public addRow(row: Row)
    {
        this._rows.push(row);
    }

    public removeRow(index: number)
    {
        this._rows.splice(index, 1);
    }
}