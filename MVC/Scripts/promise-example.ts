let p1 = (x: string) => Promise.resolve(x);
let p2 = (x: string) => Promise.resolve(x + "-Bar");
let p3 = (x: string) => Promise.resolve(x + "-Baz");

p1("Foo")
    .then(p2)
    .then(p3)
    .then(x => console.log(x));

Promise.resolve("Foo")
    .then(p2)
    .then(x => x && Promise.resolve(x) || Promise.reject(new Error("Ops!")))
    .then(p3)
    .then(x => console.log(x))
    .catch((error: Error) => error && console.log(error.message));    

Promise
    .all([p1("x"), p2("y"), p3("z")])
    .then(values => values.forEach(x => console.log(x)));

type Callback = (value: string, error?: Error) => void;

function callback1(value: string): string
{
    let result: string;

    callback2(x => callback3(y => result = value + x + y));
    return result;
}

function callback2(callback: Callback): void
{
    callback("-Bar", new Error());
}

function callback3(callback: Callback): void
{
    callback("-Baz");
}

let c1 = value => c2(x => c3(y  => value + x + y));
let c2 = (callback: Callback) => callback("-Bar");
let c3 = (callback: Callback) => callback("-Baz");

c1("Foo");

let c1e = value => c2((x, e) => !e && (c3((y, e1) => !e1 && value + x + y || console.log(e1.message))) || console.log(e.message));