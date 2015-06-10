/*global define, amplify */

define([
    'jquery',
    'fx-cat-br/config/events',
    'amplify'
], function ($, E) {

    'use strict';

    function ResultsController() {
    }

    //(injected)
    ResultsController.prototype.grid = undefined;

    //(injected)
    ResultsController.prototype.resultsRenderer = undefined;

    ResultsController.prototype.renderComponents = function () {
        this.grid.render();
    };

    ResultsController.prototype.preValidation = function () {

        if (!this.grid) {
            throw new Error("ResultsController: INVALID GRID ITEM.");
        }
        if (!this.resultsRenderer) {
            throw new Error("ResultsController: INVALID RENDER ITEM.");
        }
    };

    ResultsController.prototype.bindEventListeners = function() {

        amplify.subscribe(E.SEARCH_ANALYZE_SUB, this, this.onAnalyze);

        amplify.subscribe(E.EDIT_METADATA_SUB, this, this.onShowMetadata);
    };

    ResultsController.prototype.render = function () {

        this.preValidation();

        this.bindEventListeners();

        this.renderComponents();
    };

    ResultsController.prototype.addItems = function (obj) {

        this.grid.clear();

        if (obj.results) {
            var items = obj.results;

            for (var i = 0; i < items.length; i++) {
                this.grid.addItems(this.resultsRenderer.getInstance(items[i], obj.filter));
            }
        }
    };

    ResultsController.prototype.clear = function () {
        this.grid.clear();
    };

    /* event callback */

    ResultsController.prototype.onAnalyze = function (e, payload) {
        //Listen to it on Fx-catalog-page
        $(e.currentTarget).trigger(E.SEARCH_ANALYZE, [payload]);
    };

    ResultsController.prototype.onShowMetadata = function (e, payload) {
        //Listen to it on Fx-catalog-page

        var loc = './createdataset.html?resourceType=%rt&uid=%u'.replace("%rt", "dataset").replace("%u", payload.uid);
        document.location.href = loc;
    };

    /* end event callback */

    ResultsController.prototype.unbindEventListeners = function(){

        amplify.unsubscribe(E.SEARCH_ANALYZE_SUB, this.onAnalyze);

        amplify.unsubscribe(E.EDIT_METADATA_SUB, this.onShowMetadata);

    };

    ResultsController.prototype.destroy = function () {
        this.grid.destroy();
        this.unbindEventListeners();
    };

    return ResultsController;

});