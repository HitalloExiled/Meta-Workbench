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
    private _orientation: Stack.Orientation;
    
    @metadata
    public get orientation(): Stack.Orientation
    {
        return this._orientation;
    }

    public set orientation(value: Stack.Orientation)
    {
         this._orientation = value;
    }
    
    constructor()
    {
        super();
    }
}