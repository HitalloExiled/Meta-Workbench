type Func<TResult>          = () => TResult;
type Func1<T1, TResult>     = (arg: T1) => TResult;
type Func2<T1, T2, TResult> = (arg1: T1, arg2: T2) => TResult;

type Action             = () => void;
type Action1<T1>        = (arg: T1) => void;
type Action2<T1, T2>    = (arg1: T1, arg2: T2) => void;

abstract class Enumerable<TSource> implements Iterable<TSource>
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

    public firstOrDefault(): TSource|null
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

class WhereIterator<TSource> extends Enumerable<TSource>
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

class DefaultIfEmptyIterator<TSource> extends Enumerable<TSource>
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

class SelectIterator<TSource, TResult> extends Enumerable<TResult>
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

interface Array<T> extends Enumerable<T>
{ }

Array.prototype.select = function <T, TResult>(this: Array<T>, selector: Func1<T, TResult>)
{
    return new SelectIterator(this, selector);
}

Array.prototype.where = function <T, TResult>(this: Array<T>, predicate: Func1<T, boolean>)
{
    return new WhereIterator(this, predicate);
}

Array.prototype.defaultIfEmpty = function <T>(this: Array<T>, defaultValue: T)
{
    return new DefaultIfEmptyIterator(this, defaultValue)
}

Array.prototype.firstOrDefault = function <T>(this: Array<T>)
{
    return this[Symbol.iterator]().next().value;
}

let values = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .where(x => x > 5)
    //.select(x => `value of x is ${x}`)
    //.defaultIfEmpty("Foo")
    .toArray();

console.log(values);

let values2 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .where(x => x > 5)
    .select((x, i) => `value of x is ${x}, index is ${i}`)
    .defaultIfEmpty("Foo");

console.log(values2);

for (let item of values2)
    console.log(item);