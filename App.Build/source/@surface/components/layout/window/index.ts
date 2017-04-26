import { CustomElement } from "@surface/core/custom-element";
import { View }          from "@surface/core/view";
import { component }     from "@surface/core/decorators";

import template from "index.html";
import style    from "index.scss";

@component("layout-window", template, style)
export class Window extends CustomElement
{    
    private _title: string;
    
    public get title(): string
    {
        return this._title;
    }

    public set title(value: string)
    {
        this._title = value;
    }    

    private _view:  Nullable<View>;    
    public get view(): Nullable<View>
    {
        if (this.shadowRoot)
        {
            this._view = super.attach<View>(/^view-/);
            return this.view;
        }
        return null;
    }

    public set view(value: Nullable<View>)
    {
        if (this.shadowRoot && value)
        {
            if (this._view)
                this.replaceChild(value, this._view)
            else
                this.appendChild(value);

            this.title = value.title;
        }
        this._view = value;
    }
}
