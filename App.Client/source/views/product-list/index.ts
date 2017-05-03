import "@surface/components/layout/stack";

import { component } from '@surface/core/decorators';
import { View }      from "@surface/core/view";

import "@surface/components/data/grid";

import template from "index.html";
import style    from "index.scss";

@component("view-product-list", template, style)
export class ProductList extends View
{
    public get title(): string
    {
        return "Lista de produtos";
    }

    public get source(): Array<object>
    {
        let values =
        [
            { col1: "Linha 1 - Coluna 1", col2: "Linha 1 - Coluna 2" },
            { col1: "Linha 2 - Coluna 1", col2: "Linha 2 - Coluna 2" },
            { col1: "Linha 3 - Coluna 1", col2: "Linha 3 - Coluna 2" }
        ];

        return values;
    }

    constructor()
    {
        super();
    }
}