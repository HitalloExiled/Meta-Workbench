import "@surface/components/layout/stack";

import { component } from '@surface/core/decorators';
import { View }      from "@surface/core/view";

import template from "index.html";
import style    from "index.scss";

@component("view-product-registration", template, style)
export class ProductRegistration extends View
{
    public get title(): string
    {
        return "Cadastro de produtos";
    }

    constructor()
    {
        super();
    }
}