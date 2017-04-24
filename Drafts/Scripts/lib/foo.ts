class Foo
{
    private _a: number;
    private _b: string;
    private _c: boolean;
    
    constructor(a: number, b: string, c: boolean)
    {
        this._a = a;
        this._b = b;
        this._c = c;
    }

    public saySomethig(): void
    {
        alert("Hello!!!")
    }
}