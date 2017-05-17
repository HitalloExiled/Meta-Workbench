import { CustomElement } from "@surface/core/custom-element";

export class ElementBinder<T extends CustomElement>
{
    private _context: T;
    private _content: Node;

    public constructor(context: T, content: Node)
    {
		this._context = context;
        this._content = content;
	}

    public bind(): void
    {
        this.traverseElement(this._content);
    }

    private traverseElement(node: Node): void
    {    
        for (let i = 0; i < node.childNodes.length; i++)
        {
            let currentNode = node.childNodes[i];
            if (currentNode.nodeType == Node.TEXT_NODE)
                this.bindTextNode(currentNode);

            if (currentNode.attributes)
                this.bindAttribute(currentNode);

            this.traverseElement(currentNode);
        }
    }

    private bindTextNode(node: Node): void
    {
        let onChange: () => void;
        if (node.nodeValue && node.nodeValue.indexOf("{{") > -1)
        {
            let groups = node.nodeValue.match(/(.*?)(?:{{ *(\w+) *}})(.*?)|(.*)/g)
            if (groups && groups.length > 0)
            {
                let matches = groups.map(x => x && /(.*?)(?:{{ *(\w+) *}})(.*?)|(.*)/g.exec(x) || [""]);
                let fragments = matches.map
                (
                    item =>
                    {
                        let [left, property, right, remaining] = item.slice(1);                        

                        if (property)
                        {
                            let observedAttributes = this._context[CustomElement.Symbols.observedAttributes] as Array<string>;
                            if (observedAttributes && observedAttributes.filter(x => x == property).length > 0)
                            {
                                this._context.onAtributeChanged.add
                                (
                                    (sender, args) =>
                                    {
                                        if (args.attributeName == property) 
                                            onChange();
                                    }
                                );
                            }
                            else
                            {
                                let descriptor = Object.getOwnPropertyDescriptor(this._context.constructor.prototype, property)
                                if (descriptor)
                                {
                                    let getter = descriptor.get;
                                    let setter = descriptor.set;
                                    
                                    Object.defineProperty
                                    (
                                        this._context,
                                        property,
                                        {
                                            get: () => getter && getter.call(this._context),
                                            set: (value: any) =>
                                            {
                                                setter && setter.call(this._context, value);
                                                onChange();
                                            }
                                        }
                                    );
                                }
                            }
                        }
                        return () => (left || "") + (this._context[property] || "") + (right || "") + (remaining || "");
                    }
                );

                onChange = () => node.nodeValue = fragments.map(x => x()).join("");
                onChange();
            }
        }
    }

    private bindAttribute(node: Node): void
    {
        type Binder = { source: string, target: string };

        let onChange: () => void;

        let binders: Array<Binder> = [];

        node.attributes.asEnumerable().forEach
        (
            attribute =>
            {
                if (attribute.value.indexOf("{{") > -1)
                {
                    let match = /{{ *(\w+) *}}/.exec(attribute.value);
                    let property = match && match[1] || "";
                    if (property)
                    {                        
                        let observedAttributes = this._context[CustomElement.Symbols.observedAttributes] as Array<string>;
                        if (observedAttributes && observedAttributes.filter(x => x == property).length > 0)
                        {
                            binders.push({ source: property, target: attribute.name });

                            this._context.onAtributeChanged.add
                            (
                                (sender, args) =>
                                {
                                    if (args.attributeName == property) 
                                        onChange();
                                }
                            );
                        }
                        else
                        {
                            let descriptor = Object.getOwnPropertyDescriptor(this._context.constructor.prototype, property)
                            if (descriptor)
                            {
                                binders.push({ source: property, target: attribute.name });

                                let getter = descriptor.get;
                                let setter = descriptor.set;
                                
                                Object.defineProperty
                                (
                                    this._context,
                                    property,
                                    {
                                        get: () => getter && getter.call(this._context),
                                        set: (value: any) =>
                                        {
                                            setter && setter.call(this._context, value);
                                            onChange();
                                        }
                                    }
                                );
                            }
                        }
                    }
                }
            }
        );

        onChange = () => binders.forEach(x => node[x.target] = this._context[x.source]);
        onChange();
    }
}