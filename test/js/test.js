define([
    'loglevel',
    'jquery',
    'underscore',
    'fx-catalog/start',
    'i18n!test/nls/labels'
], function (log, $, _, Catalog) {

    'use strict';

    var s = {
            STANDARD: "#standard"
        },
        catalogs = [];

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
            $el: s.STANDARD,
            defaultSelectors: ['resourceType', 'contextSystem'],
            environment: "distribution",
            selectorsRegistry : {
                contextSystem : {
                    selector : {
                        id : "dropdown",
                        source : [
                            {value : "cstat_mdg", label : "CountrySTAT Madagascar"},
                            {value : "uneca", label : "UNECA"}
                        ],
                        default : ["cstat_mdg"],
                        hideSummary : true
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
            //id : "my_id"
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