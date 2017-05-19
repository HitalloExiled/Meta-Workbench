import { CustomElement } from "@surface/core/custom-element";
import { component }     from "@surface/core/decorators";

import template from "index.html";
import style    from "index.scss";

@component("data-footer", template, style)
export class Footer extends CustomElement
{
    public constructor()
    {
        super();
    }
}