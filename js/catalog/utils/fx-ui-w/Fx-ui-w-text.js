/*global define, amplify*/
define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons",
    "fx-cat-br/config/events",
    "amplify"
], function ($, W_Commons, E) {

    'use strict';

    var o = {
     lang : 'EN'
    }, w_commons;

    function Fx_ui_w_Name() {
        w_commons = new W_Commons();
    }

    Fx_ui_w_Name.prototype.validate = function (e) {
        return true;
    };

    Fx_ui_w_Name.prototype.render = function (e, container) {

        o.container = container;

        o.module = e;

        var text = document.createElement('INPUT');

        text.setAttribute("type", "TEXT");

        if (e.component.hasOwnProperty("rendering")) {

            if (e.component.rendering.hasOwnProperty("placeholder")) {

                if (e.component.rendering.placeholder.hasOwnProperty(o.lang)) {
                    text.setAttribute("placeholder", e.component.rendering.placeholder[o.lang]);
                } else {
                    text.setAttribute("placeholder", e.component.rendering.placeholder['EN']);
                }
            }
        }

        if (e.component.rendering.hasOwnProperty("htmlattributes")) {

            Object.keys(e.component.rendering.htmlattributes).forEach(function (entry) {
                text[entry] = e.component.rendering.htmlattributes[entry];
            });

        }

        $(text).on('keyup', {w_commons : w_commons, type: o.module.type }, function(e){

            amplify.publish(E.MODULE_READY,
                { value : [{label: $(o.container).find("input").val()}],
                    module:  e.data.type });


        });

        $(container).append(text);

        this.bindEventListeners();
    };

    Fx_ui_w_Name.prototype.bindEventListeners = function () {

        var that = this;

        amplify.subscribe(E.MODULE_DESELECT+ '.' +o.module.type, function (e) {

            that.deselectValue(e.detail);

        }, false);
    };

    Fx_ui_w_Name.prototype.deselectValue = function () {
        $(o.container).find('input').val('');
    };

    Fx_ui_w_Name.prototype.getValue = function (e) {
        return { enumeration :  [$("#" + e.id + " > input").val()]};
    };

    return Fx_ui_w_Name;
});