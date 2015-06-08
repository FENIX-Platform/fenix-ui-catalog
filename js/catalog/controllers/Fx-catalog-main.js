/*global define, amplify */

define([
    'jquery',
    'nprogress',
    'pnotify',
    'intro',
    'amplify'
], function ($, NProgress, PNotify, IntroJS) {

    'use strict';

    var o = {
        events: {
            ANALYZE_SUB: 'resultAnalyze',
            ANALYZE: 'analyze'
        },
        storage: {
            CATALOG: 'fx.catalog'
        }
    };

    function MainController() {

      /*  //workaround for unbinding
        this.onSubmit = $.proxy(this.onSubmit, this);
        this.onEndCatalogSearch = $.proxy(this.onEndCatalogSearch, this);
        this.onEmptyResponse = $.proxy(this.onEmptyResponse, this)*/
    }

    MainController.prototype.initIntroduction = function () {

        $('#how-does-it-work-btn').on('click', function (e) {

            var intro = new IntroJS();

            intro.setOptions({'showButtons': true, 'showBullets': false});

            intro.setOptions({
                steps: [
                    {
                        intro: "Select an attribute",
                        element: document.querySelector('.fx-catalog-modular-menu-container')
                    },
                    {
                        element: document.querySelector('.fx-catalog-modular-form-wrapper'),
                        intro: "Filter the values"
                    },
                    {
                        element: document.querySelector('.fx-resume-bar'),
                        intro: "Verify the values"
                    },
                    {
                        element: '#fx-catalog-submit-btn',
                        intro: 'Search for data',
                        position: 'left'
                    }
                ]
            });

            intro.start();
        });

    };

    //(injected)
    MainController.prototype.storage = undefined;

    //(injected)
    MainController.prototype.filter = undefined;

    //(injected)
    MainController.prototype.bridge = undefined;

    //(injected)
    MainController.prototype.results = undefined;

    MainController.prototype.render = function () {

        this.preValidation();
        this.bindEventListeners();
        this.renderComponents();
        this.initIntroduction();
    };

    MainController.prototype.preValidation = function () {
        if (!this.filter) {
            throw new Error("PAGE CONTROLLER: INVALID FILTER ITEM.");
        }
    };

    MainController.prototype.bindEventListeners = function () {

        amplify.subscribe("fx.catalog.submit", this, this.onSubmit);
        amplify.subscribe("fx.catalog.query.end", this, this.onEndCatalogSearch);
        amplify.subscribe("fx.catalog.query.empty_response", this, this.onEmptyResponse);
        amplify.subscribe(o.events.ANALYZE_SUB, this, this.onAnalyze);

/*        document.body.addEventListener("submit.catalog.fx", this.onSubmit );

        document.body.addEventListener("end.query.catalog.fx", this.onEndCatalogSearch);

        document.body.addEventListener("empty_response.query.catalog.fx", this.onEmptyResponse);

 $('body').on(o.events.ANALYZE_SUB, this.onAnalyze);*/


    };

    MainController.prototype.unbindEventListeners = function () {

        amplify.unsubscribe("fx.catalog.submit", this.onSubmit);
        amplify.unsubscribe("fx.catalog.query.end", this.onEndCatalogSearch);
        amplify.unsubscribe("fx.catalog.query.empty_response", this.onEmptyResponse);
        amplify.unsubscribe(o.events.ANALYZE_SUB, this.onAnalyze);

       /* document.body.removeEventListener("submit.catalog.fx", this.onSubmit);

        document.body.removeEventListener("end.query.catalog.fx", this.onEndCatalogSearch);

        document.body.removeEventListener("empty_response.query.catalog.fx", this.onEmptyResponse);

        $('body').off(o.events.ANALYZE_SUB);
        */

    };

    /* event callback */

    MainController.prototype.onSubmit = function () {

        NProgress.start();
        this.bridge.query(this.filter, $.proxy(function ( response ){

            this.results.addItems( { results : response, filter : this.filter.getD3PFilter() });

            }, this), this.results);
        //this.filter.collapseFilter();
    };

    MainController.prototype.onEndCatalogSearch = function () {
        NProgress.done();
    };

    MainController.prototype.onEmptyResponse = function () {

        this.results.clear();

        new PNotify({
            title: 'No Result Notice',
            text: 'The request has no results',
            type: 'error',
            nonblock: {
                nonblock: true
            }
        });
    };

    MainController.prototype.onAnalyze = function (e, payload) {

        /*self.storage.getItem(o.storage.CATALOG, function (item) {
         var a = JSON.parse(item) || [];
         a.push({uid: payload.uid, version: payload.version});
         self.storage.setItem(o.storage.CATALOG, JSON.stringify(a));
         $(e.currentTarget).trigger(o.events.ANALYZE, [payload]);
         });*/
        //$(e.currentTarget).trigger(o.events.ANALYZE, [payload]);
        amplify.publish(o.events.ANALYZE, [payload]);
    };

    /* end event callback */

    MainController.prototype.renderComponents = function () {
        this.filter.render();
        this.results.render();
    };

    MainController.prototype.destroy = function () {

        this.filter.destroy();

        this.results.destroy();

        this.unbindEventListeners();
    };

    return MainController;

});