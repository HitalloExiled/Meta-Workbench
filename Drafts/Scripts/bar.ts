class Bar extends Foo
{
    private _d: Date;
    public get d(): Date
    {
        return this._d;
    }

    constructor(a: number, b: string, c: boolean, d: Date)
    {
        super(a, b, c);

        this._d = d;

        super.saySomethig();        
    }
}