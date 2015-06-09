/* global define */

define(function () {

    'use strict';

    return {
        //Filter
        MODULE_SELECT: "fx.catalog.module.select",
        MODULE_REMOVE: "fx.catalog.module.remove",
        MODULE_READY : "fx.catalog.module.ready",
        MODULE_DESELECT : "fx.catalog.module.deselect",


        //Main Controller

        SEARCH_SUBMIT : "fx.catalog.submit",
        SEARCH_QUERY_END : "fx.catalog.query.end",
        SEARCH_QUERY_EMPTY_RESPONSE : "fx.catalog.query.empty_response",

        SEARCH_ANALYZE_SUB: 'resultAnalyze',
        EDIT_METADATA_SUB : 'clickResultEditMetadata',

        SEARCH_ANALYZE: 'analyze',
        EDIT_METADATA : "resultEditMetadata"

    };

});
