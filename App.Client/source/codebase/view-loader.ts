import { View } from "@surface/core/view";
export function loadView(view: string): Promise<Constructor<View>>
{
    return load(view);
}

function load(view: string): Promise<Constructor<View>>
{
    switch (view)
    {
        case "view-product-catalog":
            return new Promise<Constructor<View>>(resolve => require["ensure"]("views/product-catalog", () => resolve(require("views/product-catalog").ProductCatalog)));
        case "view-product-registration":
            return new Promise<Constructor<View>>(resolve => require["ensure"]("views/product-registration", () => resolve(require("views/product-registration").ProductRegistration)));
        default:
            return Promise.reject("path not found");
    }
}