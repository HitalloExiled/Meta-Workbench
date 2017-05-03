import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";
import { List }          from "@surface/core/enumerable";
import { Column }        from "@surface/components/data/column";

import template from "index.html";

@component("data-row", template)
export class Row extends CustomElement
{
    private _columns: List<Column>;
    public get columns(): List<Column>
    {
        return this._columns;
    }

    public set columns(value: List<Column>)
    {
        this._columns = value;
    }

    public constructor()
    {
        super();
    }
}