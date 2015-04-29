define(function () {

    'use strict';

    return {

        TOP_MENU: {
            url: 'config/submodules/fx-menu/fenix-ui-topmenu_config.json',
            active: "createdataset"
        },


        DSD_EDITOR_CONTEXT_SYSTEM: 'demo1',
        DSD_EDITOR_DATASOURCES: ['D3S'],
        DSD_EDITOR_SUBJECTS: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Subjects.json",
        DSD_EDITOR_DATATYPES: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Datatypes.json",
        DSD_EDITOR_CODELISTS: "config/submodules/DSDEditor/CodelistsUAE.json",


        CATALOG_BLANK_FILTER: 'config/submodules/catalog/uae-catalog-blank-filter.json',


        METADATA_EDITOR_GUI: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-gui-config.json",
        METADATA_EDITOR_VALIDATION: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-validation-config.json",
        METADATA_EDITOR_JSON_MAPPING: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-mapping-config.json",
        //METADATA_EDITOR_AJAX_EVENT_CALL: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-ajax-config_fenix.json",
        METADATA_EDITOR_AJAX_EVENT_CALL: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-ajax-config_DEV.json",
        METADATA_EDITOR_DATES: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-dates-config.json",


        //BASE_ADDRESS: "http://fenix.fao.org/d3s_dev/msd",
        //BASE_ADDRESS: "http://fenix.fao.org/d3s/msd",
        SERVICE_BASE_ADDRESS: "http://fenix.fao.org/d3s_fenix/msd",
        SERVICE_GET_DATA_METADATA: { service: "resources", queryParams: { full: true, dsd: true } },
        SERVICE_SAVE_METADATA: { service: "resources/metadata" },
        SERVICE_SAVE_DSD: { service: "resources/dsd" },
        SERVICE_SAVE_DATA: { service: "resources" },
        SERVICE_RESOURCES_FIND: { service: "resources/find" }
    };
});
