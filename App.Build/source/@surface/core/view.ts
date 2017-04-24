import { CustomElement } from "@surface/core/custom-element";

export abstract class View extends CustomElement
{
    public onLoad:  (target: View) => void;
    public onClose: (target: View) => void;

    public constructor()
    {
        super();
    }

    public show(): void
    { }

    public hide(): void
    { }
}