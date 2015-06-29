/*global define, amplify*/
define([
    "jquery",
    "fx-cat-br/config/events",
    "amplify"
], function ($, E) {

    'use strict';

    var o = {
     lang : 'EN'
    };

    function Fx_ui_w_text() {}

    Fx_ui_w_text.prototype.validate = function () {
        return true;
    };

    Fx_ui_w_text.prototype.render = function (e, container, opts) {

        o.container = container;

        o.module = e;

        o.options = opts;

        var text = document.createElement('INPUT');

        text.setAttribute("type", "TEXT");

        if (e.component.hasOwnProperty("rendering")) {

            if (e.component.rendering.hasOwnProperty("placeholder")) {

                if (e.component.rendering.placeholder.hasOwnProperty(o.lang)) {
                    text.setAttribute("placeholder", e.component.rendering.placeholder[o.lang]);
                } else {
                    text.setAttribute("placeholder", e.component.rendering.placeholder.EN);
                }
            }
        }

        if (e.component.rendering.hasOwnProperty("htmlattributes")) {

            Object.keys(e.component.rendering.htmlattributes).forEach(function (entry) {
                text[entry] = e.component.rendering.htmlattributes[entry];
            });

        }

        $(text).on('keyup', function(){

            amplify.publish(E.MODULE_READY,
                { value : [{label: $(o.container).find("input").val()}],
                    id: o.module.id,
                    label :  o.module.label.EN,
                    options : o.options
                });

        });

        $(container).append(text);

        this.bindEventListeners();
    };

    Fx_ui_w_text.prototype.bindEventListeners = function () {

        var that = this;

        amplify.subscribe(E.MODULE_DESELECT+ '.' + o.module.id, function (e) {

            that.deselectValue(e);

        });
    };

    Fx_ui_w_text.prototype.deselectValue = function () {

        $(o.container).find('input').val('');
    };

    Fx_ui_w_text.prototype.getValue = function (e) {
        return { enumeration :  [$("#" + e.id + "  input").val()]};
    };

    return Fx_ui_w_text;
});