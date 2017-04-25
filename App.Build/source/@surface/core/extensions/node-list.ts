interface NodeList
{
    toArray(): Array<Node>;
}

interface NodeListOf<TNode extends Node> extends NodeList
{
     toArray(): Array<TNode>;
}

NodeList.prototype.toArray = function(this: NodeList)
{
    return Array.from(this);
}