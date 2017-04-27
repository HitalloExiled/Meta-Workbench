import * as Webpack from "webpack";
import * as Path    from "path";

import devConfig  from "./development";
import prodConfig from "./production";

import { InjectViewPlugin } from "../../source/@surface/plugins/inject-view-plugin";

export default (env: string) =>
{
    const DEV          = "DEV";
    const ROOT         = Path.resolve(__dirname, "../../");
    const SOURCE       = Path.resolve(ROOT, "./source");
    const NODE_MODULES = Path.resolve(ROOT, "./node_modules");
    const SERVER       = Path.resolve(ROOT, "../App.Server/public");
    
    let config = 
    {
        devtool: "#source-map",
        context: SOURCE,
        entry:   { "app-main": Path.resolve(SOURCE, "app-main/index.ts") },
        output:
        {
            path:          SERVER,
            publicPath:    "",
            filename:      "[name]/[hash].js",
            libraryTarget: "umd"
        } as Webpack.Output,
        resolve:
        {
            extensions: [".ts", ".js"],
            modules:
            [
                ".",
                SOURCE,
                NODE_MODULES
            ]
        } as Webpack.Resolve,
        module:
        {
            rules:
            [
                {
                    test: /\.(png|jpe?g|svg)$/,
                    use:
                    [
                        {
                            loader: "file-loader",
                            options: { name: "/resources/[hash].[ext]" }
                        }
                    ]
                },
                {
                    test: /\.s[ac]ss$/,
                    use:
                    [
                        { loader: "to-string-loader" },
                        { loader: "css-loader" },
                        { loader: "sass-loader" }
                    ]
                },
                {
                    test: /\.html$/,
                    use:
                    [
                        {   
                            loader: "html-loader",
                            options:
                            {
                                attrs: ["img:src", "link:href", "script:src"],
                                minify: true
                            }
                        }
                    ]
                },
                {
                    test: /\.ts$/,
                    use:
                    [
                        {
                            loader: "ts-loader",
                            options:
                            {
                                compilerOptions:
                                {
                                    noEmit: false,
                                    target: "es6"
                                }
                            },
                        }
                    ]
                },
            ] as Array<Webpack.Rule>,
        } as Webpack.Module
    } as Webpack.Configuration;

    let envConfig = env == DEV ? devConfig : prodConfig;

    envConfig.plugins = envConfig.plugins || [];
    envConfig.plugins.push(new InjectViewPlugin({ useHash: true, views: ["app-main"] }));
    envConfig.plugins.push(new Webpack.IgnorePlugin(/vertx/));

    return Object.assign
    (
        config,
        envConfig
    ) as Webpack.Configuration;
}