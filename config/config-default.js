/* global define */
define(function () {

    'use strict';

    return {

        SERVICE_BASE_ADDRESS: "http://fenix.fao.org/d3s/msd",
        SERVICE_GET_DATA_METADATA: { service: "resources", queryParams: { full: true, dsd: true } },
        SERVICE_SAVE_METADATA: { service: "resources/metadata" },
        SERVICE_SAVE_DSD: { service: "resources/dsd" },
        SERVICE_SAVE_DATA: { service: "resources" },
        SERVICE_RESOURCES_FIND: { service: "resources/find" } ,


        PLUGIN_FOLDER_PATH : "fx-cat-br/utils/fx-ui-w/",

        SEARCH_PER_PAGE : 15
    };
});
