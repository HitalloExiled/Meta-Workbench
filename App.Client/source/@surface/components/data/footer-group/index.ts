import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";
import { List }          from "@surface/core/enumerable/list";
import { Footer }        from "@surface/components/data/footer";

import template from "index.html";
import style    from "index.scss";

@component("data-footer-group", template, style)
export class FooterGroup extends CustomElement
{    
    private _columns = super.attachAll<Footer>("data-footer");

    public set columns(value: List<Footer>)
    {
        this._columns.forEach(x => this.removeChild(x));
        value.forEach(x => this.appendChild(x));
        this._columns = value;
    }

    public addColumn(column: Footer): void
    {
        this._columns.add(column);
        this.appendChild(column);
    }

    public removeColumn(column: Footer): void
    {
        this._columns.remove(column);
        this.removeChild(column);
    }

    public constructor()
    {
        super();
    }
}