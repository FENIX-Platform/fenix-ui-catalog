/*global amplify, define*/

define([
    "jquery",
    'handlebars',
    "text!fx-cat-br/html/fx_result_fragments.html",
    'amplify'
], function ($, Handlebars, resultTemplate) {

    'use strict';

    //Default Result options
    var defaultOptions = {
        error_prefix: "FENIX Result dataset creation error: "
    }, $result;

    function Fx_catalog_result_render_dataset(options) {

        this.o = {};
        $.extend(this.o, options);
    }

    Fx_catalog_result_render_dataset.prototype.addActions = function () {

        var self = this,
            actions,
            key;

        if (this.o.hasOwnProperty('actions')) {

            actions = this.o.actions;

            for (key in actions) {

                var $b = $('<button class="btn btn-default">' + actions[key].labels.EN + '</button>');

                $b.on('click', function (e) {
                    //Listen to it within Fx-catalog-results-generator
                    //$(e.currentTarget).trigger(actions[key].event, [self.o]);
                    amplify.publish('fx.widget.catalog.' + actions[key].event, self.o);
                });

                $result.find('.results-actions-container').prepend($b);
            }
        }
    };

    Fx_catalog_result_render_dataset.prototype.getHtml = function () {

        $.extend(this.o, defaultOptions);

        var template = Handlebars.compile(resultTemplate),
            result = template(this.o);

        $result = $(result);

        $result.addClass("dataset");

        this.addActions();

        return $result.get(0);
    };

    return Fx_catalog_result_render_dataset;
});
