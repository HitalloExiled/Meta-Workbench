import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";
import { Column }        from "@surface/components/data/column";

import template from "index.html";

@component("data-row", template)
export class Row extends CustomElement
{
    private _columns: Array<Column>;
    public get columns(): Array<Column>
    {
        return this._columns;
    }

    public set columns(value: Array<Column>)
    {
        this._columns = value;
    }

    public constructor()
    {
        super();
    }
}