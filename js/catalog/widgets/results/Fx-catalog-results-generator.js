/*global amplify, define*/
define([
    'jquery',
    "fx-cat-br/widgets/results/renderers/Fx-result-renderer-dataset",
    "fx-cat-br/widgets/results/renderers/Fx-result-renderer-layer",
    "amplify"
], function ($, Dataset, Layer) {

    'use strict';

    var o = {
        events : {
            ANALYZE_SUB : "clickResultAnalyzeBtn",
            ANALYZE : 'clickResultAnalyze'
        }
    };

    function Fx_catalog_results_generator(options) {
        this.o = options || {};
        this.initEventListeners();
    }

    Fx_catalog_results_generator.prototype.initEventListeners = function(){

        amplify.subscribe(o.events.ANALYZE_SUB, function (payload) {
              amplify.publish(o.events.ANALYZE, [payload]);
        });

    };

    Fx_catalog_results_generator.prototype.getInstance = function (options, filter) {

        return new Dataset($.extend(true, {filter: filter}, options, this.o )).getHtml();
    };

    return Fx_catalog_results_generator;

});