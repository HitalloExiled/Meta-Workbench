import { CustomElement } from "@surface/core/custom-element";
import { View }          from "@surface/core/view";

import { component }     from "@surface/core/decorators";

import template from "index.html";

@component("layout-slot-view", template)
export class SlotView extends CustomElement
{
    public get view(): Nullable<View>
    {
        if (this.shadowRoot)
            return this.shadowRoot.firstChild as Nullable<View>;
        return null;
    }

    public set view(value: Nullable<View>)
    {
        if (this.shadowRoot && value)
        {
            if (this.shadowRoot.firstChild && this.view)
                this.shadowRoot.replaceChild(value, this.view)
                
            this.shadowRoot.appendChild(value);
        }
    }
}
