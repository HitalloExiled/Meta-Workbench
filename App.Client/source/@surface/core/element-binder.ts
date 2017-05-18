import { CustomElement } from "@surface/core/custom-element";

enum BindType
{
    attribute = 1,
    text      = 2
}

type Binder =
{
    context:   object;
    property:  string,
    node:      Node;
    attribute: string,
    bindType:  BindType
}

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
        this.traverseElement(this._content, this._context);
    }

    private traverseElement(node: Node, context: object): void
    {    
        for (let i = 0; i < node.childNodes.length; i++)
        {
            let currentNode = node.childNodes[i];
            if (currentNode.nodeType == Node.TEXT_NODE)
                this.bindTextNode(currentNode, context);

            if (currentNode.attributes)
                this.bindAttribute(currentNode, context);

            this.traverseElement(currentNode, context);
        }
    }

    private bindTextNode(node: Node, context: object): void
    {
        let binders: Array<Func<string>> = [];
        let onChange = () => node.nodeValue = binders.map(x => x()).join("");

        if (node.nodeValue && node.nodeValue.indexOf("{{") > -1)
        {
            let groups = node.nodeValue.match(/(.*?)(?:{{ *(?:(\w+|\.)) *}})(.*?)|(.*)/g)
            if (groups && groups.length > 0)
            {
                let matches = groups.map(x => x && /(.*?)(?:{{ *((?:\w|\.)+) *}})(.*?)|(.*)/g.exec(x) || [""]);
                matches.forEach
                (
                    item =>
                    {
                        let [left, match, right, remaining] = item.slice(1);

                        let binder = 
                        {
                            context:   context,
                            node:      node,
                            attribute: "",
                            property:  match,
                            bindType:  BindType.text
                        }

                        if (match)
                            this.applyBind(binder, onChange);

                        binders.push(() => (left || "") + (context[match] || "") + (right || "") + (remaining || ""));
                    }
                );
                
                onChange();
            }
        }
    }

    private bindAttribute(node: Node, context: object): void
    {
        let binders: Array<Action> = []; 
        let onChange = () => binders.forEach(x => x());

        node.attributes.asEnumerable().forEach
        (
            attribute =>
            {
                if (attribute.value.indexOf("{{") > -1)
                {
                    let match    = /{{ *(\w+) *}}/.exec(attribute.value);
                    let property = match && match[1] || "";

                    let binder =
                    {
                        context:   context,
                        node:      node,
                        attribute: attribute.name,
                        property:  match && match[1] || "",
                        bindType:  BindType.attribute
                    }

                    if (property)
                        binders.push(this.applyBind(binder, onChange));
                }
            }
        );
        
        onChange();
    }

    private applyBind(binder: Binder, onChange: Action): Action
    {
        let action: Action = () => ({});

        let context = binder.context;

        let property = binder.property;

        if (property.indexOf(".") > -1)
        {
            let childrens = property.split(".");
            property = childrens.pop() || "";
            for (let child of childrens)
            {
                context = context[child];
                if (!context)
                    break;
            }
        }

        let observedAttributes = context[CustomElement.Symbols.observedAttributes] as Array<string>;
        if (observedAttributes && observedAttributes.filter(x => x == property).length > 0)
        {
            if (binder.bindType == BindType.attribute)
                action = () => binder.node[binder.attribute] = context[property];
            
            let onAttributeChanged = context[CustomElement.Symbols.onAttributeChanged];
            context[CustomElement.Symbols.onAttributeChanged] = function (this: CustomElement, attributeName: string, oldValue: string, newValue: string, namespace: string): void
            {
                if (attributeName == property)
                    onChange();

                if (onAttributeChanged)
                    onAttributeChanged.call(context, attributeName, oldValue, newValue, namespace);
            }
        }
        else
        {
            let descriptor = Object.getOwnPropertyDescriptor(context.constructor.prototype, property)
            if (descriptor)
            {
                if (binder.bindType == BindType.attribute)
                    action = () => binder.node[binder.attribute] = context[property];

                let getter = descriptor.get;
                let setter = descriptor.set;
                
                Object.defineProperty
                (
                    context,
                    property,
                    {
                        get: () => getter && getter.call(context),
                        set: (value: any) =>
                        {
                            setter && setter.call(context, value);
                            onChange();
                        }
                    }
                );
            }
        }

        return action;
    }
}