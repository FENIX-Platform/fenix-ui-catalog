/*global define */

define([
    'jquery',
    'nprogress',
    'pnotify',
    'intro'
], function ($, NProgress, PNotify, IntroJS) {

    var o = {
        events: {
            ANALYZE_SUB: 'resultAnalyze',
            ANALYZE: 'analyze'
        },
        storage: {
            CATALOG: 'fx.catalog'
        }
    };

    function PageController() {
    }

    PageController.prototype.initIntroduction = function () {

        $('#how-does-it-work-btn').on('click', function(e){

            var intro = IntroJS();

            intro.setOptions({ 'showButtons': true, 'showBullets': false });

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
                        element: document.querySelector('.fx-catalog-resume-bar'),
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
    PageController.prototype.storage = undefined;

    //(injected)
    PageController.prototype.filter = undefined;

    //(injected)
    PageController.prototype.bridge = undefined;

    //(injected)
    PageController.prototype.results = undefined;

    PageController.prototype.renderComponents = function () {
        this.filter.render();
        this.results.render();
    };

    PageController.prototype.initEventListeners = function () {

        var self = this;

        document.body.addEventListener("submit.catalog.fx", function () {
            NProgress.start();
            self.bridge.query(self.filter, self.results.addItems, self.results);
            //self.filter.collapseFilter();
        }, false);

        document.body.addEventListener("end.query.catalog.fx", function () {
            NProgress.done();
        }, false);

        document.body.addEventListener("empty_response.query.catalog.fx", function () {

            self.results.clear();

            new PNotify({
                title: 'No Result Notice',
                text: 'The request has no results',
                type: 'error',
                nonblock: {
                    nonblock: true
                }
            });
        }, false);

        $('body').on(o.events.ANALYZE_SUB, function (e, payload) {


            /*self.storage.getItem(o.storage.CATALOG, function (item) {
                var a = JSON.parse(item) || [];
                a.push({uid: payload.uid, version: payload.version});
                self.storage.setItem(o.storage.CATALOG, JSON.stringify(a));
                $(e.currentTarget).trigger(o.events.ANALYZE, [payload]);
            });*/
            $(e.currentTarget).trigger(o.events.ANALYZE, [payload]);
        });
    };

    PageController.prototype.preValidation = function () {
        if (!this.filter) {
            throw new Error("PAGE CONTROLLER: INVALID FILTER ITEM.")
        }
    };

    PageController.prototype.render = function () {

        this.preValidation();
        this.initEventListeners();
        this.renderComponents();
        this.initIntroduction();
    };

    return PageController;

});