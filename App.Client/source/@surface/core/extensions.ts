interface Array<T>
{
    /** Flatten multidimensional arrays */
    flat(this: Array<T>): T

    /** Compatibility com HTMLSlotElement polyfill */
    toArray(): Array<T>;
}

Array.prototype.flat = function<T>(this: Array<T>)
{
    let items: Array<T> = [];

    for (const item of this)
    {
        if (Array.isArray(item))
            item.flat().forEach(x => items.push(x))
        else
            items.push(item);
    }

    return items;
}

Array.prototype.toArray = function<T>(this: Array<T>)
{
    return this;
}

interface NodeList
{
    /** Casts NodeList to array */
    toArray(): Array<Node>;
}

interface NodeListOf<TNode extends Node> extends NodeList
{
     toArray(): Array<TNode>;
}

NodeList.prototype.toArray = function(this: NodeList)
{
    return Array.from(this);
}