if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {

    var config = {

        paths: {
            'fx-catalog/start': './catalog',
            'fx-catalog/html': '../html',
            'fx-catalog/js': './',
            'fx-catalog/config' :  '../config',
            'fx-catalog/nls' :  '../nls',

            //3rd party libs
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'handlebars': "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
            'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
            i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
            text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            bootstrap : "{FENIX_CDN}/js/bootstrap/3.3.4/js/bootstrap.min",
            q: '{FENIX_CDN}/js/q/1.1.2/q',
            "bootstrap-table" : '{FENIX_CDN}/js/bootstrap-table/1.10.1/dist/bootstrap-table.min',
            moment : '{FENIX_CDN}/js/moment/2.12.0/min/moment.min'
        },

        shim: {
            bootstrap : {
                deps : ['jquery']
            },
            underscore: {
                exports: '_'
            },
            'amplify' : {
                deps : ['jquery']
            },
            handlebars: {
                exports: 'Handlebars'
            },
            "bootstrap-table" : {
                deps : ['jquery', 'bootstrap']
            }
        }
    };

    return config;
});