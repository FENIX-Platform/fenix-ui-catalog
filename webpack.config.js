/*global require, module, __dirname, process */

var distFolderPath = "dist",
    demoFolderPath = "demo",
    devFolderPath = "dev",
    webpack = require('webpack'),
    packageJson = require("./package.json"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    Path = require('path'),
    dependencies = Object.keys(packageJson.dependencies);

module.exports = {

    debug: isProduction(false, true),

    devtool: isProduction('source-map', 'eval'),

    entry: getEntry(),

    output: getOutput(),

    node: {
        fs: "empty"
    },

    resolve: {
        root: Path.resolve(__dirname),
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js',
            jquery: Path.join(__dirname, 'node_modules/jquery/dist/jquery'),
            bootstraptable: Path.join(__dirname, 'node_modules/bootstrap-table/dist/bootstrap-table.js')
        }
    },

    externals: isProduction(dependencies, undefined),

    module: {
        /*        preLoaders: [
         {test: /\.js$/, exclude: /node_modules/, loader: "jshint-loader"}
         ],*/
        loaders: [
            {test: /\.hbs$/, loader: "handlebars-loader"},
            {test: /\.json$/, loader: "json-loader"},
            {test: /bootstrap.+\.(jsx|js)$/, loader: 'imports?jQuery=jquery,$=jquery'}
        ]
    },

    plugins: clearArray([
        isDemo(undefined, new CleanWebpackPlugin([distFolderPath])),
        isProduction(new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false}
        }))
    ])

};

function getEntry() {

    "use strict";

    var entry = {};

    switch (getEnvironment()) {

        case "demo" :
            entry.app = ["demo/src/js/demo.js"];
            break;
        case "develop" :
            entry.app = ["dev/src/js/dev.js"];
            break;
        default :
            entry.app = ["./src/js/index.js"];
    }

    return entry;
}

function getOutput() {

    "use strict";

    var output;

    switch (getEnvironment()) {

        case "demo" :
            output = {
                path: Path.join(__dirname, demoFolderPath, distFolderPath),
                filename: "index.js"
            };
            break;
        case "production" :
            output = {
                path: Path.join(__dirname, distFolderPath),
                filename: packageJson.name + '.min.js',
                chunkFilename: 'chunk-[id].' + packageJson.name + '.min.js',
                libraryTarget: 'amd'
            };
            break;
        case "develop" :
            output = {
                path: Path.join(__dirname, devFolderPath, distFolderPath),
                //publicPath: "/dev/",
                filename: "index.js"
            };
            break;
        default :
            output = {
                path: Path.join(__dirname, distFolderPath),
                filename: "index.js"
            };
            break;
    }

    return output;
}

// utils

function clearArray(array) {

    "use strict";

    var result = [];

    array.forEach(function (s) {
        if (s) {
            result.push(s);
        }
    });

    return result;

}

function isProduction(valid, invalid) {
    "use strict";

    return isEnvironment('production') ? valid : invalid;
}

function isDevelop(valid, invalid) {

    "use strict";

    return isEnvironment('develop') ? valid : invalid;
}

function isTest(valid, invalid) {

    "use strict";

    return isEnvironment('develop') ? valid : invalid;
}

function isDemo(valid, invalid) {
    "use strict";

    return isEnvironment('demo') ? valid : invalid;
}

function isEnvironment(env) {
    "use strict";

    return getEnvironment() === env;
}

function getEnvironment() {
    "use strict";

    return process.env.NODE_ENV;
}