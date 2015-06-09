/*global amplify, define*/
define([
    'jquery',
    "fx-cat-br/widgets/results/renderers/Fx-result-renderer-dataset",
    "fx-cat-br/widgets/results/renderers/Fx-result-renderer-layer",
    "fx-cat-br/config/events",
    "amplify"
], function ($, Dataset, Layer, E) {

    'use strict';

    function Fx_catalog_results_generator(options) {
        this.o = options || {};
        this.initEventListeners();
    }

    Fx_catalog_results_generator.prototype.initEventListeners = function(){

        amplify.subscribe(E.SEARCH_ANALYZE_SUB, function (payload) {
              amplify.publish(E.SEARCH_ANALYZE, [payload]);
        });

    };

    Fx_catalog_results_generator.prototype.getInstance = function (options, filter) {

        return new Dataset($.extend(true, {filter: filter}, options, this.o )).getHtml();
    };

    return Fx_catalog_results_generator;

});