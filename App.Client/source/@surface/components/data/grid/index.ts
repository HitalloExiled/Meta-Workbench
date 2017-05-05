import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";
import { List }          from "@surface/core/enumerable";
import { Row }           from "@surface/components/data/row";
import { Column }        from "@surface/components/data/column";

import template   from "index.html";

@component("data-grid", template)
export class Grid extends CustomElement
{
    private _rows:     List<Row>;
    private _headers:  List<Column> = super.attachAll<Column>("data-column");
    
    private _source: Iterable<Object>;
    public get source(): Iterable<Object>
    {
        return this._source;
    }
    
    public set source(value: Iterable<Object>)
    {
        this._source = value;
    }

    public get rows(): List<Row>
    {
        return this._rows;
    }

    public addRow(row: Row)
    {
        this._rows.add(row);
        this.appendChild(row);
    }

    public removeRow(index: number)
    {
        let row = this._rows.item(index);
        this.removeChild(row);
    }

    public constructor()
    {
        super();
        this.initialize();
    }

    public initialize(): void
    {
        for (let item of this._source)
        {
            let row = new Row();
            for (let column of this._headers)
            {
                column.nodeValue = item.toString();
                row.columns.add(column);
            }

            this.addRow(row);
        }
    }
}