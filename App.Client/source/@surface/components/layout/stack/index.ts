import { CustomElement }                from "@surface/core/custom-element";
import { component, observe, metadata } from "@surface/core/decorators";

import template from "index.html";
import style    from "index.scss";

export namespace Stack
{
    export type Orientation = "vertical"|"horizontal";
}

@component("layout-stack", template, style)
@observe("width", "height", "orientation")
export class Stack extends CustomElement
{    
    @metadata
    public get orientation(): Stack.Orientation
    {        
        if (super.getAttribute("h") || super.getAttribute("horizontal"))
            return "horizontal";
        else
            return "vertical";
    }

    public set orientation(value: Stack.Orientation)
    {
         super.setAttribute(value, "");
    }
    
    constructor()
    {
        super();
    }
}