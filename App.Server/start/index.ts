import HTTP  = require("http");
import Path  = require("path");
import Utils = require("./content/utils");

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
                Utils.loadFile(response, Path.join(DEFAULT, "index.html"));
            }
            else if (request.url && /^\/[^\/]+$/.test(request.url))
            {
                if (request.url.indexOf(".") > 0) 
                    Utils.loadFile(response, Path.join(DEFAULT, request.url || ""));
                else
                    Utils.loadFile(response, Path.join(DEFAULT, "index.html"));
            }
            else if (request.url)
            {
                let url = request.url.replace(/\/(.*)/, "$1");
                Utils.loadFile(response, Path.resolve(PUBLIC, url));
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