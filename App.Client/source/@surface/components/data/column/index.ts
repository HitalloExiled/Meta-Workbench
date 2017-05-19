import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";

import template from "index.html";
import style    from "index.scss";

@component("data-column", template, style)
export class Column extends CustomElement
{
    public get content(): Nullable<HTMLElement>
    {
        return this.firstElementChild as Nullable<HTMLElement>;
    }

    private _value: Nullable<Object>;
    public get value(): Nullable<Object>
    {
        return this._value;
    }

    public set value(value: Nullable<Object>)
    {
        this.innerText = value && value.toString() || "";
        this._value = value
    }

    public constructor()
    {
        super();
    }
}