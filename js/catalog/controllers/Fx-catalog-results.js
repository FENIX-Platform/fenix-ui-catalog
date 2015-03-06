/*global define, amplify */

define([
    'jquery',
    'amplify'
], function ($) {

    var o = {
        events : {
            ANALYZE_SUB : 'clickResultAnalyze',
            EDIT_METADATA_SUB : 'clickResultEditMetadata',
            ANALYZE: 'resultAnalyze',
            EDIT_METADATA : "resultEditMetadata"
        }
    };

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
            throw new Error("ResultsController: INVALID GRID ITEM.")
        }
        if (!this.resultsRenderer) {
            throw new Error("ResultsController: INVALID RENDER ITEM.")
        }
    };

    ResultsController.prototype.render = function () {
        this.preValidation();
        this.bindEventListeners();
        this.renderComponents();
    };

    ResultsController.prototype.addItems = function (response) {

        this.grid.clear();

        if (response) {
            var items = response;

            for (var i = 0; i < items.length; i++) {
                this.grid.addItems(this.resultsRenderer.getInstance(items[i]));
            }
        }
    };

    ResultsController.prototype.clear = function () {
        this.grid.clear();
    };

    ResultsController.prototype.bindEventListeners = function(){

        amplify.subscribe(o.events.ANALYZE_SUB, this, this.onAnalyze);
        amplify.subscribe(o.events.EDIT_METADATA_SUB, this, this.onShowMetadata);
/*
        $('body').on(o.events.ANALYZE_SUB, this.onAnalyze);

        $('body').on(o.events.EDIT_METADATA_SUB,  this.onShowMetadata);*/
    };

    /* event callback */

    ResultsController.prototype.onAnalyze = function (e, payload) {
        //Listen to it on Fx-catalog-page
        $(e.currentTarget).trigger(o.events.ANALYZE, [payload]);
    };

    ResultsController.prototype.onShowMetadata = function (e, payload) {
        //Listen to it on Fx-catalog-page
        //$(e.currentTarget).trigger(o.events.EDIT_METADATA, [payload]);

        var loc = './createdataset.html?resourceType=%rt&uid=%u'.replace("%rt", "dataset").replace("%u", payload.uid);
        document.location.href = loc;
    };

    /* end event callback */

    ResultsController.prototype.unbindEventListeners = function(){

        amplify.unsubscribe(o.events.ANALYZE_SUB, this.onAnalyze);
        amplify.unsubscribe(o.events.EDIT_METADATA_SUB, this.onShowMetadata);
/*
        $('body').off(o.events.ANALYZE_SUB);

        $('body').off(o.events.EDIT_METADATA_SUB);*/
    };

    ResultsController.prototype.destroy = function () {
        this.grid.destroy();
        this.unbindEventListeners();
    };

    return ResultsController;

});