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
                this.parseTextNode(currentNode);

            this.traverseElement(currentNode);
        }
    }

    private parseTextNode(node: Node): void
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
                        let [left, propertyName, right, alternative] = item.slice(1);
                        

                        if (propertyName)
                        {
                            let observedAttributes = this._context[CustomElement.Symbols.observedAttributes] as Array<string>;
                            if (observedAttributes && observedAttributes.filter(x => x == propertyName).length > 0)
                            {
                                this._context.onAtributeChanged.add
                                (
                                    (sender, args) =>
                                    {
                                        if (args.attributeName == propertyName) 
                                            onChange();
                                    }
                                );
                            }
                            else
                            {
                                let descriptor = Object.getOwnPropertyDescriptor(this._context.constructor.prototype, propertyName)
                                if (descriptor)
                                {
                                    let getter = descriptor.get;
                                    let setter = descriptor.set;
                                    
                                    Object.defineProperty
                                    (
                                        this._context,
                                        propertyName,
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
                        return () => (left || "") + (this._context[propertyName] || "") + (right || "") + (alternative || "");
                    }
                );

                onChange = () => node.nodeValue = fragments.map(x => x()).join("");
                onChange();
            }
        }
    }
}