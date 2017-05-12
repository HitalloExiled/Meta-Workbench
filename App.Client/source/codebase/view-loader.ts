import { View } from "@surface/core/view";
export function loadView(view: string): Promise<Constructor<View>>
{
    return load(view);
}

function load(view: string): Promise<Constructor<View>>
{
    switch (view)
    {
        case "/view-product-catalog":
            return new Promise<Constructor<View>>(resolve => require["ensure"]([], () => resolve(require("views/product-catalog").default)));
        case "/view-product-registration":
            return new Promise<Constructor<View>>(resolve => require["ensure"]([], () => resolve(require("views/product-registration").default)));
        case "/view-product-list":
            return new Promise<Constructor<View>>(resolve => require["ensure"]([], () => resolve(require("views/product-list").default)));
        default:
            return Promise.reject("path not found");
    }
}