import { Enumerable } from "@surface/core/enumerable";

declare global
{
    interface Array<T> extends Enumerable<T>
    {
        /** Flatten multidimensional arrays */
        flat(this: Array<T>): T;
        /** Casts Array to Enumerable */
        asEnumerable(): Enumerable<T>;
    }

    interface NodeList extends Enumerable<Node>
    {
        /** Casts NodeList to array */
        toArray(): Array<Node>;
        /** Casts NodeList to Enumerable */
        asEnumerable(): Enumerable<Node>;
    }

    interface NodeListOf<TNode extends Node> extends NodeList, Enumerable<TNode>
    {
        toArray():      Array<TNode>;
        asEnumerable(): Enumerable<TNode>;
    }
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

Array.prototype.select = function <T, TResult>(this: Array<T>, selector: Func1<T, TResult>)
{
    return Enumerable.from(this).select(selector);
}

Array.prototype.where = function <T>(this: Array<T>, predicate: Func1<T, boolean>)
{
    return Enumerable.from(this).where(predicate);
}

Array.prototype.firstOrDefault = function <T>(this: Array<T>)
{
    return Enumerable.from(this).firstOrDefault();
}

Array.prototype.defaultIfEmpty = function <T>(this: Array<T>, value: T)
{
    return Enumerable.from(this).defaultIfEmpty(value);
}

Array.prototype.asEnumerable = function <T>(this: Array<T>)
{
    return Enumerable.from(this);
}

NodeList.prototype.select = function <T extends Node, TResult>(this: NodeListOf<T>, selector: Func2<T, number, TResult>)
{
    return Enumerable.from(Array.from(this)).select(selector);
}

NodeList.prototype.where = function <T extends Node>(this: NodeListOf<T>, predicate: Func1<T, boolean>)
{
    return Enumerable.from(Array.from(this)).where(predicate);
}

NodeList.prototype.firstOrDefault = function <T extends Node>(this: NodeListOf<T>)
{
    return Enumerable.from(Array.from(this)).firstOrDefault();
}

NodeList.prototype.defaultIfEmpty = function <T extends Node>(this: NodeListOf<T>, value: T)
{
    return Enumerable.from(Array.from(this)).defaultIfEmpty(value);
}

NodeList.prototype.asEnumerable = function <T extends Node>(this: NodeListOf<T>)
{
    return Enumerable.from(Array.from(this));
}

NodeList.prototype.toArray = function<T extends Node>(this: NodeListOf<T>)
{
    return Array.from(this);
}