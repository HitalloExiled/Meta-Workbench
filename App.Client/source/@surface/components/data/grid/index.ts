import { CustomElement }      from "@surface/core/custom-element";
import { component, observe } from "@surface/core/decorators";
import { List }               from "@surface/core/enumerable/list";

import "@surface/components/data/column";
import { Column } from "@surface/components/data/column";

import "@surface/components/data/footer";
import { Footer } from "@surface/components/data/footer";

import "@surface/components/data/footer-group";
import { FooterGroup } from "@surface/components/data/footer-group";

import "@surface/components/data/header";
import { Header } from "@surface/components/data/header";

import "@surface/components/data/header-group";
import { HeaderGroup } from "@surface/components/data/header-group";

import "@surface/components/data/row";
import { Row } from "@surface/components/data/row";

import "@surface/components/data/row-group";
import { RowGroup } from "@surface/components/data/row-group";

import template from "index.html";
import style    from "index.scss";


@component("data-grid", template, style)
@observe("width", "height", "margin")
export class Grid extends CustomElement
{    
    private _headers      = super.attachAll<Header>("data-header");
    private _headerGroups = super.attachAll<HeaderGroup>("data-header-group");
    private _rows         = super.attachAll<Row>("data-row");
    private _rowGroups    = super.attachAll<RowGroup>("data-row-group");
    private _footers      = super.attachAll<Footer>("data-footer");
    private _footerGroups = super.attachAll<FooterGroup>("data-footer-group");
    
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

    public get rowGroups(): List<RowGroup>
    {
        return this._rowGroups;
    }

    public get headerGroups(): List<HeaderGroup>
    {
        return this._headerGroups;
    }

    public get footerGroups(): List<FooterGroup>
    {
        return this._footerGroups;
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

    public addFooterGroup(footerGroup: FooterGroup): void
    {
        this._footerGroups.add(footerGroup);
        this.appendChild(footerGroup);
    }

    public removeFooterGroup(index: number): void
    {
        let footerGroup = this._footerGroups.item(index);
        this._footerGroups.remove(index);
        this.removeChild(footerGroup);
    }

    public addHeaderGroup(headerGroup: HeaderGroup): void
    {
        this._headerGroups.add(headerGroup);
        this.appendChild(headerGroup);
    }

    public removeHeaderGroup(index: number): void
    {
        let headerGroup = this._headerGroups.item(index);
        this._headerGroups.remove(index);
        this.removeChild(headerGroup);
    }

    public addRowGroup(rowGroup: RowGroup): void
    {
        this._rowGroups.add(rowGroup);
        this.appendChild(rowGroup);
    }

    public removeRowGroup(index: number): void
    {
        let rowGroup = this._rowGroups.item(index);
        this._rowGroups.remove(index);
        this.removeChild(rowGroup);
    }

    public initialize(): void
    {
        if (this._headers.length > 0)
        {
            let headerGroup = new HeaderGroup();
            headerGroup.columns = this._headers;
            this.addHeaderGroup(headerGroup);
        }

        if (this._rows.length > 0)
        {
            let rowGroup = new RowGroup();
            rowGroup.rows = this._rows;
            this.addRowGroup(rowGroup);
        }

        let rowGroup = new RowGroup();
        Array.from(this._source).asEnumerable().forEach
        (
            (value, index) =>
            {
                let row = new Row();
                row.even = index % 2 == 0;
                for (let header of this._headerGroups.first().columns)
                {
                    let column = new Column();
                    column.value = value[header.bound];
                    row.addColumn(column);
                }
                rowGroup.addRow(row);
            }
        );

        this.addRowGroup(rowGroup);

        if (this._footers.length > 0)
        {
            let footerGroup = new FooterGroup();
            footerGroup.columns = this._footers;
            this.addFooterGroup(footerGroup);
        }

        /*
        {
            let headerRow = new Row();
            headerRow.isHeader = true;
            this._headerGroups.selectMany(x => x.columns).forEach
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
                    this._headerGroups.selectMany(x => x.columns).forEach
                    (
                        header =>
                        {
                            let column = new Column();
                            column.innerText = item[header.bound];

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
        if (this._footerGroups.length == 0 && this._footers.length > 0) { }
        */

        
    }

    public connectedCallback(): void
    {
        this.initialize();
    }
}