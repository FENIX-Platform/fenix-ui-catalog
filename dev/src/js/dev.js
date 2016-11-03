define([
    'loglevel',
    'jquery',
    'underscore',
    '../../../src/js/index'
], function (log, $, _, Catalog) {

    'use strict';

    var s = {
            STANDARD: "#standard"
        },
        catalogs = [],
        lang = "EN",
        environment = "production";

    function Dev() {

        this._importThirdPartyCss();

        console.clear();

        log.setLevel('trace');

        this.start();
    }

    Dev.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Dev.prototype._render = function () {

        this._renderStandard();
    };

    Dev.prototype._renderStandard = function () {

        var catalog = this.createCatalog({
            el: s.STANDARD,
            lang : lang,
            defaultSelectors: ['resourceType', 'contextSystem'],
            environment: environment,
            hideCloseButton : true,
            pluginRegistry : {
                contextSystem : {
                    selector : {
                        id : "dropdown",
                        source : [
                            {value : "cstat_afg", label : "CountrySTAT Afghanistan"},
                            {value : "uneca", label : "UNECA"}
                        ],
                        default : ["cstat_afg"],
                        hideSummary : true,
                        config : {
                            plugins: ['remove_button'],
                            mode: 'multi'
                        }
                    },

                    template : {
                        hideRemoveButton : false
                    },

                    format : {
                        output : "enumeration",
                        metadataAttribute: "dsd.contextSystem"
                    }
                }
            }
            //actions: ["download", 'view'],
            //baseFilter : { test : "test"}
        });
    };

    //Utils

    Dev.prototype.createCatalog = function (params) {

        var instance = new Catalog(params);

        catalogs.push(instance);

        return instance;
    };

    // utils

    Dev.prototype._importThirdPartyCss = function () {

        //Bootstrap
        require('bootstrap/dist/css/bootstrap.css');

        //dropdown selector
        require("../../../node_modules/selectize/dist/css/selectize.bootstrap3.css");
        // fenix-ui-filter
        require("../../../node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");
        // fenix-ui-dropdown
        require("../../../node_modules/fenix-ui-dropdown/dist/fenix-ui-dropdown.min.css");

        // bootstrap-table
        require("../../../node_modules/bootstrap-table/dist/bootstrap-table.min.css");

    };

    return new Dev();

});