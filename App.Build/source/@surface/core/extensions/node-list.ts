declare interface NodeList
{
    toArray(): Array<Node>;
}

declare interface NodeListOf<TNode extends Node> extends NodeList
{
     toArray(): Array<TNode>;
}

NodeList.prototype.toArray = function(this: NodeList)
{
    let nodes: Array<Node> = [];

    for (let i = 0; i < this.length; i++)
        nodes.push(this.item(i));

    return nodes;
}