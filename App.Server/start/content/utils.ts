import HTTP            = require('http');
import Path            = require('path');
import FS              = require('fs');
import ServerVariables = require('./server-variables');

export function loadFile(response: HTTP.ServerResponse, path: string): void
{
    try
    {
        let extension = Path.extname(path);
        let data      = FS.readFileSync(path);

        response.writeHead(200, { "Content-Type": ServerVariables.mymeType[extension] });
        response.write(data);
        response.end();
    }
    catch (error)
    {
        throw error;
    }
}