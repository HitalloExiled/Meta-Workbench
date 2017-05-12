namespace InjectViewPlugin
{
    export interface Options
    {
        views?:    Array<string>;
        template?: (entry: string) => string;
        useHash?:  boolean;
    }
}

class InjectViewPlugin
{
    private _options: InjectViewPlugin.Options|null;

    constructor(options?: InjectViewPlugin.Options)
    {
        if (options)
            this._options = options;
    }

    public apply (compiler: any)
    {
        const self = this;
        compiler.plugin
        (
            "emit",
            function (this: any, compilation: any, callback: (error?: Error) => void)
            {
                let entries: Array<string>;
                if (self._options && self._options.views)
                    entries = self._options.views;
                else
                    entries = compilation.entries.map(x => x.context.replace(this.context, "").replace(/\\/g, "/"));

                for (let entry of entries)
                {
                    let template: string;
                    if (self._options && self._options.template)
                        template = self._options.template(entry);
                    else
                    {
                        let view = entry.replace(/\/(view)s?\/((?:\w|\-)+)/, "$1-$2");
                        template = `<${view}></${view}>`;
                    }

                    let src = self._options && !!self._options.useHash ?
                        compilation.hash :
                        "index";

                    let html =
                    [
                        `<!DOCTYPE html>`,
                        `<html>`,
                        `     <head>`,
                        `         <meta charset="UTF-8">`,
                        `         <meta name="viewport" content="width=device-width, initial-scale=1.0">`,
                        `         <meta http-equiv="X-UA-Compatible" content="ie=edge">`,
                        `         <script type="text/javascript" src="${src}.js"></script>`,
                        `         <style>`,
                        `             body`,
                        `             {`,
                        `                 display:  flex;`,
                        `                 width:    100vw;`,
                        `                 height:   100vh;`,
                        `                 overflow: hidden;`,
                        `                 margin:   0;`,
                        `             }`,
                        `         </style>`,
                        `     </head>`,
                        `     <body>`,
                        `         ${template}`,
                        `     </body>`,
                        `</html>`,
                    ].join("\n");

                    compilation.assets[`${entry}/index.html`] =
                    {
                        source: () => html,
                        size:   () => html.length
                    };
                }

                callback();
            }
        );
    };
}

export = InjectViewPlugin;