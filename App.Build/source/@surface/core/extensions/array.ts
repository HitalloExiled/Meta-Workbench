interface Array<T>
{
    /** Flatten multidimensional arrays */
    flat(this: Array<T>): T
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