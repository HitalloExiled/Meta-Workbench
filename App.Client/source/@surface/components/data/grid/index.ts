import { CustomElement }      from "@surface/core/custom-element";
import { component, observe } from "@surface/core/decorators";
import { List }               from "@surface/core/enumerable/list";
import { Row }                from "@surface/components/data/row";
import { Column }             from "@surface/components/data/column";

import template from "index.html";
import style    from "index.scss";

@component("data-grid", template, style)
@observe("width", "height", "margin")
export class Grid extends CustomElement
{
    private _rows:    List<Row>    = new List<Row>();
    private _headers: List<Column> = super.attachAll<Column>("data-column");
    
    private _source: Iterable<Object> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
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
    }

    public initialize(): void
    {
        let headerRow = new Row();
        headerRow.isHeader = true;
        this._headers.forEach
        (
            x =>
            {
                headerRow.addColumn(x);
                x.innerText = x.header;
            }
        );
        this.addRow(headerRow);

        Array.from(this._source).asEnumerable().forEach
        (
            (item, index) =>
            {
                let row = new Row();
                row.even = index % 2 == 0;
                this._headers.forEach
                (
                    header =>
                    {
                        let column = new Column();
                        column.innerText = item.toString();

                        Array.from(header.attributes)
                            .asEnumerable()
                            .where(x => x.name != "header")
                            .forEach(x => column.setAttribute(x.name, x.value));

                        row.addColumn(column);
                    }
                );

                this.addRow(row);
            }
        );
    }

    public connectedCallback(): void
    {
        this.initialize();
    }
}