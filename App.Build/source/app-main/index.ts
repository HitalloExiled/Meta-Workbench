import "dependencies";

import "@surface/components/layout/stack";

import "@surface/components/action/menu";
import { Menu } from "@surface/components/action/menu";

import "@surface/components/layout/slot-view";
import { SlotView }  from "@surface/components/layout/slot-view";

import { component } from "@surface/core/decorators";
import { View }      from "@surface/core/view";
import { loadView }  from "codebase/view-loader";

import template from "index.html";
import style    from "index.scss";

@component("app-main", template, style)
export class App extends View
{
    private _menu:     Menu        = super.attach<Menu>("action-menu");
    private _slotView: SlotView    = super.attach<SlotView>("layout-slot-view");
    private _views:    Array<View> = [];

    public constructor()
    {
        super();

        this._menu.items.forEach
        (
            item =>
            {
                item.addEventListener
                (
                    "click",
                    async () =>
                    {
                        let view = this._views.filter(x => x.localName == item.action)[0];
                        
                        if (!view)
                        {
                            let ViewConstructor = await loadView(item.action);
                            view = new ViewConstructor();
                            this._views.push(view);
                        }

                        this._slotView.view = view;
                        view.show();
                    }
                );
            }
        );
    }
}