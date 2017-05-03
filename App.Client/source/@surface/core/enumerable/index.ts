export abstract class Enumerable<TSource> implements Iterable<TSource>
{
    public abstract [Symbol.iterator]: () => Iterator<any>;
    /**
     * Create a enumerable object from a iterable source
     * @param source Source used to create the iterable object
     */
    public static from<T>(source: Iterable<T>): Enumerable<T>
    {
        return new EnumerableIterator(source);
    }

    /**
     * Filter the enumeration using the specified predicate
     * @param predicate Predicate used to filter the enumeration
     */
    public where(predicate: Func1<TSource, boolean>): Enumerable<TSource>
    {
        return new WhereIterator(this, predicate);
    }

    /**
     * Select the enumeration result using the specified selector
     * @param selector Selector used to returns the result
     */
    public select<TResult>(selector: Func1<TSource, TResult>): Enumerable<TResult>;
    /**
     * Select the enumeration result using the specified selector
     * @param selector Selector used to returns the result, provides a second argument with the index of the iteration
     */
    public select<TResult>(selector: Func2<TSource, number, TResult>): Enumerable<TResult>;
    public select<TResult>(selector: any): Enumerable<TResult>
    {
        return new SelectIterator<TSource, TResult>(this, selector);
    }

    /** Return the first item of the enumeration or null */
    public firstOrDefault(): Nullable<TSource>
    {
        return this[Symbol.iterator]().next().value;
    }

    /** Return the first item of the enumeration or throw a exception cause not found */
    public first(): TSource
    {
        let value = this[Symbol.iterator]().next().value;
        if (value)
            return value;
        else
            throw new Error("Value can't be null");
    }

    /**
     * Returns the provided value if the enumeration returns no result
     * @param value Default value to be used
     */
    public defaultIfEmpty(value: TSource): Enumerable<TSource>
    {
        return new DefaultIfEmptyIterator(this, value);
    }

    /** Casts the Enumerable into array */
    public toArray(): Array<TSource>
    {
        let values: Array<TSource> = [];
        let iterator  = this[Symbol.iterator]();
        let iteration = iterator.next();        

        while (!iteration.done)
        {
            values.push(iteration.value);
            iteration = iterator.next();
        }

        return values;
    }

    /** Casts the Enumerable into List */
    public toList(): List<TSource>
    {
        return new List(this.toArray());
    }

    /**
     * Iterates the enumeration by executing the specified action
     * @param action Action to be executed
     */
    public forEach(action: Action1<TSource>);
    /**
     * Iterates the enumeration by executing the specified action
     * @param action Action to be executed, provides a second argument with the index of the iteration
     */
    public forEach(action: Action2<TSource, number>);
    public forEach(action: Action2<TSource, number>)
    {
        let index = 0;
        let iterator = this[Symbol.iterator]();
        let iteration = iterator.next();
        while (!iteration.done)
        {
            action(iteration.value, index);
            iteration = iterator.next();
            index++;
        }
    }

    /** Convert enumerable to a derived type. Note that no type checking is performed at runtime */
    public cast<T extends TSource>(): Enumerable<T>
    {
        return (this as Enumerable<TSource>) as Enumerable<T>;
    }
}

export class EnumerableIterator<TSource> extends Enumerable<TSource>
{
    public [Symbol.iterator]: () => Iterator<TSource>;

    public constructor(source: Iterable<TSource>)
    {
        super();
        this[Symbol.iterator] = function*()
        {
            for (let item of source)
            {
                yield item;
            }
        }
    }
}

export class WhereIterator<TSource> extends Enumerable<TSource>
{
    public [Symbol.iterator]: () => Iterator<TSource>;

    public constructor(source: Iterable<TSource>, predicate: Func1<TSource, boolean>)
    {
        super();
        this[Symbol.iterator] = function*()
        {
            for (let item of source)
            {
                if (predicate(item))
                    yield item;
            }
        }
    }
}

export class DefaultIfEmptyIterator<TSource> extends Enumerable<TSource>
{
    public [Symbol.iterator]: () => Iterator<TSource>;

    public constructor(source: Iterable<TSource>, defaultValue: TSource)
    {
        super();
        this[Symbol.iterator] = function*()
        {
            let index = 0;
            for (let item of source)
            {
                index++;
                yield item;
            }

            if (index == 0)
                yield defaultValue;
        }        
    }
}

export class SelectIterator<TSource, TResult> extends Enumerable<TResult>
{
    public [Symbol.iterator]: () => Iterator<TResult>;

    public constructor(source: Iterable<TSource>, selector: Func2<TSource, number, TResult>)
    {
        super();
        this[Symbol.iterator] = function* ()
        {
            let index = 0;
            for (let item of source)
                yield selector(item, index++);
        }
    }
}

export class List<TSource> extends Enumerable<TSource>
{
    public [Symbol.iterator]: () => Iterator<TSource>;
    
    private _source: Array<TSource>;
    
    /** Returns Length of the list */
    public get count(): number
    {
        return this._source.length;
    }
    
    public constructor();
    /**
     * @param source Source used to create the list
     */
    public constructor(source: Array<TSource>);
    public constructor(source?: Array<TSource>)
    {
        super();
        this._source = source || [];
        let self = this;

        this[Symbol.iterator] = function* ()
        {
            for (let item of self._source)
                yield item;
        }
    }

    /**
     * Adds provided item to the list
     * @param item Item to insert
     */
    public add(item: TSource): void
    {
        this._source.push[0];
    }

    /**
     * Adds to the list the provided item at specified index
     * @param item 
     * @param index 
     */
    public addAt(item: TSource, index): void;
    public addAt(items: Array<TSource>, index): void;
    public addAt(items: List<TSource>, index): void;
    public addAt(itemOrItems: TSource|List<TSource>|Array<TSource>, index): void
    {        
        let left = this._source.splice(index + 1)
        if (Array.isArray(itemOrItems))
        {
            let items = itemOrItems;
            this._source = this._source.concat(items).concat(left);
        }
        else if (itemOrItems instanceof List)
        {
            let items = itemOrItems.toArray();
            this._source = this._source.concat(items).concat(left);
        }
        else
        {
            let item = itemOrItems;
            this._source = this._source.concat([item]).concat(left);
        }
    }

    /**
     * Removes from the list the specified item
     * @param item Item to remove
     */
    public remove(item: TSource): void;
    /**
     * Removes from the list the item in the specified index
     * @param index Position from item to remove
     */
    public remove(index: number): void;
    /**
     * Removes from the list the amount of items specified from the index
     * @param index Position from item to remove
     * @param count Quantity of items to remove
     */
    public remove(index: number, count: number): void;
    public remove(indexOritem: number|TSource, count?: number): void
    {
        let index: number            = 0;
        let item:  Nullable<TSource> = null;
        
        if (typeof indexOritem == "number")
        {
            index = indexOritem;
            this._source.splice(index, count || 1)
        }
        else
        {
            item = indexOritem;
            index = this._source.findIndex(x => Object.is(x, item));
            this._source.splice(index, 1)
        }
    }

    /**
     * Returns the item at the specified index
     * @param index Position of the item
     */
    public item(index: number): TSource
    {
        return this._source[index];
    }
}