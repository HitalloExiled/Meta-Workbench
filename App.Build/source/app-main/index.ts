import "dependencies";
import "@surface/components/layout/stack";

import "@surface/components/action/menu";
import { Menu }     from "@surface/components/action/menu";
import { MenuItem } from "@surface/components/action/menu-item/index";

import "@surface/components/layout/window";
import { Window }  from "@surface/components/layout/window";

import { component }     from "@surface/core/decorators";
import { CustomElement } from "@surface/core/custom-element";
import { View }          from "@surface/core/view";
import { loadView }      from "codebase/view-loader";

import template from "index.html";
import style    from "index.scss";

@component("app-main", template, style)
export class App extends CustomElement
{
    private _menu:   Menu           = super.attach<Menu>("action-menu");
    private _window: Window         = super.attach<Window>("layout-window");
    private _logo:   HTMLDivElement = super.attach<HTMLDivElement>("#logo");
    private _views:  Array<View> = [];

    public constructor()
    {
        super();
        this.initialiaze();        
    }

    private initialiaze(): void
    {
        let eventBind = async (item: MenuItem) =>
        {
            this._logo.style.display = "none";
            let view = this._views.filter(x => x.localName == item.action)[0];
            
            if (!view)
            {
                let ViewConstructor = await loadView(item.action);
                view = new ViewConstructor();
                this._views.push(view);
            }

            this._window.view = view;
            view.show();
        }

        this._menu.items.forEach(item => item.addEventListener("click", () => eventBind(item)));
    }
}