define([
    'loglevel',
    'jquery',
    'underscore',
    'fx-catalog/start'
], function (log, $, _, Catalog) {

    'use strict';

    var s = {
            STANDARD: "#standard"
        },
        catalogs = [],
        lang = "FR",
        environment = "production";

    function Test() {
    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Test.prototype._render = function () {

        this._renderStandard();
    };

    Test.prototype._renderStandard = function () {

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

    Test.prototype.createCatalog = function (params) {

        var instance = new Catalog(params);

        catalogs.push(instance);

        return instance;
    };

    return new Test();

});