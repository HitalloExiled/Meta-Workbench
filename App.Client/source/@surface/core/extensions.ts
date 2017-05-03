import * as Enumerables from "@surface/core/enumerable";

declare global
{
    interface Array<T>
    {
        /** Flatten multidimensional arrays */
        flatten(this:      Array<T>): T;
        /** Cast Array<T> into Enumerable<T> */
        asEnumerable(): Enumerables.Enumerable<T>;
        /** Cast Array<T> into List<T> */
        toList(): Enumerables.List<T>;
    }

    interface NodeList
    {
        /** Casts NodeList into Array<Node> */
        toArray(): Array<Node>;
        /** Cast NodeList into Enumerable<Node> */
        asEnumerable(): Enumerables.Enumerable<Node>;
        /** Cast NodeList into List<Node> */
        toList(): Enumerables.List<Node>;
    }    
}

Array.prototype.flatten = function<T>(this: Array<T>)
{
    let items: Array<T> = [];

    for (const item of this)
    {
        if (Array.isArray(item))
            item.flatten().forEach(x => items.push(x))
        else
            items.push(item);
    }

    return items;
}

Array.prototype.asEnumerable = function <T>(this: Array<T>)
{
    return new Enumerables.EnumerableIterator(this);
}

Array.prototype.toList = function <T>(this: Array<T>)
{
    return new Enumerables.List(this);
}

NodeList.prototype.toArray = function <T extends Node>(this: NodeListOf<T>)
{
    return Array.from(this);
}

NodeList.prototype.asEnumerable = function <T extends Node>(this: NodeListOf<T>)
{
    return Array.from(this).asEnumerable();
}

NodeList.prototype.toList = function <T extends Node>(this: NodeListOf<T>)
{
    return Array.from(this).toList();
}