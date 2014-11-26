/*global define */

define([
    'jquery'
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
        this.initEventListeners();
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

    ResultsController.prototype.initEventListeners = function(){

        $('body').on(o.events.ANALYZE_SUB, function (e, payload) {
            //Listen to it on Fx-catalog-page
            $(e.currentTarget).trigger(o.events.ANALYZE, [payload]);
        });
        $('body').on(o.events.EDIT_METADATA_SUB, function (e, payload) {
            //Listen to it on Fx-catalog-page
            //$(e.currentTarget).trigger(o.events.EDIT_METADATA, [payload]);

             var loc = './createdataset.html?resourceType=%rt&uid=%u'.replace("%rt", "dataset").replace("%u", payload.uid);
             document.location.href = loc;
        });
    };

    return ResultsController;

});