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
            defaultSelectors: ['resourceType']
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