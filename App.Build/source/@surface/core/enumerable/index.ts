export abstract class Enumerable<TSource> implements Iterator<TSource>
{
    public abstract next(value?: TSource): IteratorResult<TSource>;

    public static from<T>(source: Iterable<T>): Enumerable<T>
    {
        let generator = function* ()
        {
            for (let item of source)
                yield item;
        }

        return new EnumerableIterator(generator());
    }

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
        return this.next().value;
    }

    public defaultIfEmpty(value: TSource): Enumerable<TSource>
    {
        return new DefaultIfEmptyIterator(this, value);
    }

    public toArray(): Array<TSource>
    {
        let values: Array<TSource> = [];
        let iteration = this.next();        

        while (!iteration.done)
        {
            values.push(iteration.value);
            iteration = this.next();
        }

        return values;
    }

    public forEach(action: Action1<TSource>);
    public forEach(action: Action2<TSource, number>);
    public forEach(action: Action2<TSource, number>)
    {
        let index = 0;
        let iteration = this.next();
        while (!iteration.done)
        {
            action(iteration.value, index);
            iteration = this.next();
            index++;
        }
    }
}

class EnumerableIterator<TSource> extends Enumerable<TSource>
{
    private _iterator: Iterator<TSource>;
    
    public constructor(source: Iterator<TSource>)
    {
        super();
        this._iterator = source;
    }

    public next(value?: TSource): IteratorResult<TSource>
    {
        return this._iterator.next(value);
    }
}

class WhereIterator<TSource> extends EnumerableIterator<TSource>
{
    private _predicate: Func1<TSource, boolean>;

    public constructor(source: Iterator<TSource>, predicate: Func1<TSource, boolean>)
    {
        super(source);
        this._predicate = predicate;
    }

    public next(value?: TSource): IteratorResult<TSource>
    {
        let iteration = super.next(value);
        while (!iteration.done)
        {
            if (this._predicate(iteration.value))
                return iteration;

            iteration = super.next(value);
        }

        return iteration;
    }
}

class DefaultIfEmptyIterator<TSource> extends EnumerableIterator<TSource>
{
    private _defaultValue:   TSource;
    private _firstIteration: boolean = true;
    public constructor(source: Iterator<TSource>, defaultValue: TSource)
    {
        super(source);
        this._defaultValue = defaultValue;        
    }
    
    public next(value?: TSource): IteratorResult<TSource>
    {
        let iteration = super.next(value);
        
        if (this._firstIteration && iteration.done)
            iteration = { value: this._defaultValue, done: false };        
        
        this._firstIteration = false;
        return iteration;
    }
}

class SelectIterator<TSource, TResult> extends Enumerable<TResult>
{
    private _iterator: Iterator<TSource>;
    private _selector: Func2<TSource, number, TResult>;
    private _index:    number = -1;

    public constructor(source: Iterator<TSource>, selector: Func2<TSource, number, TResult>)
    {
        super();
        this._iterator = source;
        this._selector = selector;
    }

    public next(value?: TResult): IteratorResult<TResult>
    {
        let iteration = this._iterator.next(value);
        return { value: this._selector(iteration.value, this._index), done: iteration.done };
    }
}

let values = Enumerable.from([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .where(x => x > 10)
    .select(x => `value of x is ${x}`)
    .defaultIfEmpty("Foo")
    .firstOrDefault();

console.log(values);

let values2 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .where(x => x > 5)
    .select(x => `value of x is ${x}`)
    .defaultIfEmpty("Foo")
    .firstOrDefault();

console.log(values2);

document.querySelectorAll("*")
    .where(x => x.nodeType == Node.TEXT_NODE)
    .select(x => x.textContent)
    .defaultIfEmpty("null")
    .forEach((x, i) => x + i)