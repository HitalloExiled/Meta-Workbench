import "dependencies";
import "@surface/components/layout/stack";

import "@surface/components/action/menu";
import { Menu }     from "@surface/components/action/menu";
import { MenuItem } from "@surface/components/action/menu-item/index";

import "@surface/components/layout/window";
import { Window } from "@surface/components/layout/window";

import { component }     from "@surface/core/decorators";
import { CustomElement } from "@surface/core/custom-element";
import { View }          from "@surface/core/view";
import { routeTo }       from "@surface/core/router";
import { loadView }      from "codebase/view-loader";

import template from "index.html";
import style    from "index.scss";

@component("app-main", template, style)
export class App extends CustomElement
{
    private _menu:   Menu                    = super.attach<Menu>("action-menu");
    private _window: Window                  = super.attach<Window>("layout-window");
    private _logo:   HTMLDivElement          = super.attach<HTMLDivElement>("#logo");
    private _views:  { [key: string]: View } = {};

    public constructor()
    {
        super();
        this.initialiaze();
        
        this.setView(window.location.pathname);
        window.onpopstate = () => this.setView(window.location.pathname);
    }

    private initialiaze(): void
    {
        let eventBind = (item: MenuItem) =>
        {
            routeTo(item.action);
            this.setView(item.action);
        }

        this._menu.items.forEach(item => item.addEventListener("click", () => eventBind(item)));
    }

    private async setView(path: string): Promise<void>
    {
        if (path != "/")
        {
            this._logo.style.display = "none";
        }
        else
        {
            this._logo.style.display = "flex";
            return;
        }

        let view = this._views[path];
        
        if (!view)
        {
            let ViewConstructor = await loadView(path);
            view = new ViewConstructor();
            this._views[path] = view;
        }
        else if (this._window.view && Object.is(this._window.view, view))
            return;
            
        this._window.view = view;
    }
}