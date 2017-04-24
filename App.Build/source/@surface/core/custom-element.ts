export abstract class CustomElement extends HTMLElement
{
    private _template: Nullable<HTMLTemplateElement>;
	public get template(): Nullable<HTMLTemplateElement>
    {
		return this._template;
	}

	public set template(value: Nullable<HTMLTemplateElement>)
    {
		this._template = value;
	}
    
    constructor()
    {
        super();
        this.applyTemplate();
    }

    private applyTemplate(): void
    {
        if (window["ShadyCSS"])
            ShadyCSS.styleElement(this);
            
        if (this._template)
            this.attachShadow({ mode: "open" }).appendChild(document.importNode(this._template.content, true));
    }

    public attach<T extends HTMLElement>(selector: string): T
    {
        if (this.shadowRoot)
            return this.shadowRoot.querySelector(selector) as T;
        else
            return this.querySelector(selector) as T;
    }

    public attachAll<T extends HTMLElement>(selector: string): Array<T>
    {
        if (this.shadowRoot)
            return this.shadowRoot.querySelectorAll(selector).toArray() as Array<T>;
        else
            return this.querySelectorAll(selector).toArray() as Array<T>;
    }

    /** Called when the element is created or upgraded */
    public connectedCallback(): void
    {
        //if (this._template)
        //    this.appendChild(document.importNode(this._template.content, true));
    }

    /** Called when the element is inserted into a document, including into a shadow tree */
    public disconnectedCallback(): void
    { }

    /**
     * Called when an attribute is changed, appended, removed, or replaced on the element.
     * Only called for observed attributes.
     */
    public attributeChangedCallback(attributeName: string, oldValue: string, newValue: string, namespace: string): void
    {
        console.log(`attributeName: ${attributeName}, newValue: ${newValue}`);
    }

    /** Called when the element is adopted into a new document */
    public adoptedCallback(oldDocument: Document, newDocument: Document): void
    { }
}