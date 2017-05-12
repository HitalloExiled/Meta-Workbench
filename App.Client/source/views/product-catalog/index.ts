import "@surface/components/layout/stack";

import { component } from "@surface/core/decorators";
import { View }      from "@surface/core/view";

import template from "index.html";
import style    from "index.scss";

@component("view-product-catalog", template, style)
export class ProductCatalog extends View
{
    public get title(): string
    {
        return "Catalógo de produtos";
    }

    constructor()
    {
        super();
    }
}

export default ProductCatalog;