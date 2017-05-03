export abstract class Enumerable<TSource> implements Iterable<TSource>
{
    public abstract [Symbol.iterator]: () => Iterator<any>;

    public where(predicate: Func1<TSource, boolean>): Enumerable<TSource>
    {
        return new WhereIterator(this, predicate);
    }

    public select<TResult>(selector: Func1<TSource, TResult>): Enumerable<TResult>;
    public select<TResult>(selector: Func2<TSource, number, TResult>): Enumerable<TResult>;
    public select<TResult>(selector: any): Enumerable<TResult>
    {
        return new SelectIterator<TSource, TResult>(this, selector);
    }

    public firstOrDefault(): Nullable<TSource>
    {
        return this[Symbol.iterator]().next().value;
    }

    public defaultIfEmpty(value: TSource): Enumerable<TSource>
    {
        return new DefaultIfEmptyIterator(this, value);
    }

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

    public forEach(action: Action1<TSource>);
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