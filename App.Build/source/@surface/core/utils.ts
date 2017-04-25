export function dashedToCamel(value: string): string
{
    let parts = value.split("-");

    return parts.map
    (
        (item, index) =>
        {
            if (index == 0)
            {
                item = item.toLowerCase();
            }
            else
            {
                let [firstLetter, ...remaining] = item.split("");
                item = firstLetter.toUpperCase() + remaining.join("").toLowerCase();
            }
            
            return item;
        }
    )
    .join("");
}

export function traverseElement(node: Node, callback: (node: Node) => void): void
{    
    for (let i = 0; i < node.childNodes.length; i++)
    {
        let currentNode = node.childNodes[i];
        callback(currentNode);

        traverseElement(currentNode, callback);
    }
}

export function parseTextNode(node: Node, context: object): void
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
                    let propertyName = item[2];

                    if (propertyName)
                    {
                        let descriptor = Object.getOwnPropertyDescriptor(context.constructor.prototype, propertyName)
                        if (descriptor)
                        {
                            let getter = descriptor.get;
                            let setter = descriptor.set;
                            
                            Object.defineProperty
                            (
                                context,
                                propertyName,
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
                    let fragments = () =>
                    [
                        () => item[1] || "",
                        () => context[propertyName] || "",
                        () => item[3] || "",
                        () => item[4] || ""
                    ].map(x => x()).join("");
                    return fragments;
                }
            );

            onChange = () => node.nodeValue = fragments.map(x => x()).join("");
            onChange();
        }
    }
}