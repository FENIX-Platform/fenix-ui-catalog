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
        lang = "FR",
        environment = "production";

    function Dev() {
        console.clear();
        log.setLevel('trace')
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

    return new Dev();

});