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

        this.o = $.extend(true, {}, options);
    }

    Fx_catalog_result_render_dataset.prototype.addActions = function () {

        var self = this,
            actions,
            key;

        if (this.o.hasOwnProperty('actions')) {

            actions = this.o.actions;

            for (key in actions) {

                var $b = $('<button class="btn btn-default">' + actions[key].labels.EN + '</button>');

                $b.on('click', {event : actions[key].event, payload :self.o}, function (e) {
                    amplify.publish('fx.widget.catalog.' + e.data.event,  e.data.payload);
                });

                $result.find('.results-actions-container').prepend($b.clone(true));
            }
        }
    };

    Fx_catalog_result_render_dataset.prototype.getHtml = function () {

        var template = Handlebars.compile(resultTemplate),
            result = template(this.o);

        $result = $(result);

        $result.addClass("dataset");

        this.addActions();

        return $result.get(0);
    };

    return Fx_catalog_result_render_dataset;
});
