import {readFileSync} from "fs";
import * as path from "path";
import * as ts from "typescript";

function delint(sourceFile: ts.SourceFile)
{
    delintNode(sourceFile);

    function delintNode(node: ts.Node)
    {
        console.log(node.decorators);

        let message = "";

        switch (node.kind)
        {
            case ts.SyntaxKind.Decorator:
                message = "Decorator";
                break;
            case ts.SyntaxKind.ClassDeclaration:
                message = "ClassDeclaration";
                break;
            default:
                break;
        }

        report(node, message);

        ts.forEachChild(node, delintNode);
    }

    function report(node: ts.Node, message: string)
    {
        let { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message} - ${node.getText(sourceFile)} `);
    }
}

const filePath = path.resolve(__dirname, "../source/views/home/index.ts");

let sourceFile = ts.createSourceFile(filePath, readFileSync(filePath).toString(), ts.ScriptTarget.ES2015, /*setParentNodes */ true);

// delint it
delint(sourceFile);