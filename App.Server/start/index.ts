import * as HTTP from "http";
import * as FS   from "fs";
import * as Path from "path";

const PORT    = process.env.port as number || 1337
const ROOT    = Path.resolve(__dirname, "../");
const PUBLIC  = Path.join(ROOT, "public");
const DEFAULT = Path.join(PUBLIC, "app-main");

HTTP.createServer
(
    (request, response) =>
    {
        try
        {
            if (request.url == "/")
            {
                loadFile(response, Path.join(DEFAULT, "index.html"));
            }
            else if (/^\/[^\/]+$/.test(request.url || ""))
            {
                loadFile(response, Path.join(DEFAULT, request.url || ""));
            }
            else if (request.url)
            {
                let url = request.url.replace(/\/(.*)/, "$1");
                loadFile(response, Path.resolve(PUBLIC, url));
            }
        }
        catch (error)
        {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.end(error.message);
        }
    }
)
.listen(PORT);

function loadFile(response: HTTP.ServerResponse, path: string): void
{
    try
    {
        let contentType = 'text/html';
        let extension = Path.extname(path);
        switch (extension)
        {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.json':
            case '.map':
                contentType = 'application/json';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.png':
                contentType = 'image/png';
                break;      
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.svg':
                contentType = 'image/svg+xml';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
        }

        let data = FS.readFileSync(path);

        response.writeHead(200, { "Content-Type": contentType });
        response.write(data);
        response.end();
    }
    catch (error)
    {
        throw error;
    }
}