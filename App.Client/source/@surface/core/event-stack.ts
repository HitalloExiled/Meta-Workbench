
export namespace EventStack
{
    export type EventHandler<TSender, TArg> = (sender: TSender, arg: TArg) => void;
}

export class EventStack<TSender, TArg>
{
    private _events: Array<EventStack.EventHandler<TSender, TArg>> = [];

    public add(event: EventStack.EventHandler<TSender, TArg>): void
    {
        this._events.push(event);
    }

    public remove(event: EventStack.EventHandler<TSender, TArg>): void
    {
        let index = this._events.findIndex(x => Object.is(x, event));
        this._events.splice(index, 1);
    }

    public fire(sender: TSender, arg: TArg): void
    {
        this._events.forEach(x => x(sender, arg));
    }
}