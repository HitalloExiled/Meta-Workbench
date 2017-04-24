import * as Webpack from "webpack";

let uglifyOptions =
{
    beautify:  false,
    comments:  false,
    sourceMap: true
} as Webpack.UglifyPluginOptions;

export default
{
    plugins: [new Webpack.optimize.UglifyJsPlugin(uglifyOptions)]
} as Webpack.Configuration;