import * as Enumerables from "@surface/core/enumerable";

declare global
{
    interface Array<T> extends Enumerables.Enumerable<T>
    {
        /** Flatten multidimensional arrays */
        flat(this: Array<T>): T;
    }

    interface NodeList extends Enumerables.Enumerable<Node>
    {
        /** Casts NodeList to array */
        toArray(): Array<Node>;
    }

    interface NodeListOf<TNode extends Node> extends NodeList, Enumerables.Enumerable<TNode>
    {
        toArray():      Array<TNode>;
        asEnumerable(): Enumerables.Enumerable<TNode>;
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
    return new Enumerables.SelectIterator(this, selector);
}

Array.prototype.where = function <T>(this: Array<T>, predicate: Func1<T, boolean>)
{
    return new Enumerables.WhereIterator(this, predicate);
}

Array.prototype.firstOrDefault = function <T>(this: Array<T>)
{
    return this[Symbol.iterator]().next().value;
}

Array.prototype.defaultIfEmpty = function <T>(this: Array<T>, defaultValue: T)
{
    return new Enumerables.DefaultIfEmptyIterator(this, defaultValue);
}

NodeList.prototype.select = function <T extends Node, TResult>(this: NodeListOf<T>, selector: Func2<T, number, TResult>)
{
    return new Enumerables.SelectIterator(this, selector);
}

NodeList.prototype.where = function <T extends Node>(this: NodeListOf<T>, predicate: Func1<T, boolean>)
{
    return new Enumerables.WhereIterator(this, predicate);
}

NodeList.prototype.firstOrDefault = function <T extends Node>(this: NodeListOf<T>)
{
    return Array.from(this)[Symbol.iterator]().next().value;
}

NodeList.prototype.defaultIfEmpty = function <T extends Node>(this: NodeListOf<T>, defaultValue: T)
{
    return new Enumerables.DefaultIfEmptyIterator(this, defaultValue);
}

NodeList.prototype.toArray = function<T extends Node>(this: NodeListOf<T>)
{
    return Array.from(this);
}