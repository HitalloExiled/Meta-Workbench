import { CustomElement } from "@surface/core/custom-element";

export abstract class View extends CustomElement
{    
    abstract get title(): string;

    public onLoad:  (target: View) => void;
    public onHide:  (target: View) => void;
    public onClose: (target: View) => void;

    public constructor()
    {
        super();
    }

    public show(): void
    {
        this.onLoad && this.onLoad(this);
    }

    public hide(): void
    {
        this.onHide && this.onLoad(this);
    }

    public close(): void
    {
        this.onClose && this.onLoad(this);
    }
}