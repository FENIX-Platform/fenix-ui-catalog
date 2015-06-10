/*global define, amplify */

define([
    "jquery",
    'fx-cat-br/config/config',
    'fx-cat-br/config/config-default',
    'fx-cat-br/config/events',
    "amplify"
], function ($, C, DC, E) {

    'use strict';

    var o = {},
        defaultOptions = {
            error_prefix: "Fx_catalog_bridge ERROR: "
        }, plugin;

    function Fx_catalog_bridge() { }

    Fx_catalog_bridge.prototype.init = function (options) {

        //Merge options
        $.extend(true, o, defaultOptions, options);

        return this;
    };

    Fx_catalog_bridge.prototype.query = function (src, callback, cont) {

        var context = cont || this;

        if (!window.Fx_catalog_bridge_plugins || typeof window.Fx_catalog_bridge_plugins !== "object") {
            throw new Error(o.error_prefix + " Fx_catalog_bridge_plugins plugins repository not valid.");
        } else {
            plugin = window.Fx_catalog_bridge_plugins[src.getName()];
        }

        if (!plugin) {
            throw new Error(o.error_prefix + " plugin not found.");
        }

        if (typeof plugin.init !== "function") {
            throw new Error(o.error_prefix + " plugin for " + src.getName() + " does not have a public init() method.");
        } else {
            plugin.init($.extend({ component: src }, o));
        }

        if (typeof callback !== "function") {
            throw new Error(o.error_prefix + " callback param is not a function");
        } else {

            if (o.blankFilter) {
                this.getCustomBlankFilter(callback, context);
            } else {
                this.performQuery(callback, context);
            }

        }
    };

    Fx_catalog_bridge.prototype.getCustomBlankFilter = function (callback, context) {

        var self = this;

        $.getJSON(o.blankFilter, function (data) {

            plugin.init({ blankFilter: data });

            self.performQuery(callback, context);

        });

    };

    Fx_catalog_bridge.prototype.performQuery = function (callback, context) {

        var SERVICE_PREFIX = C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS;

        var url = SERVICE_PREFIX + "/resources/find";

        //Ask the plugin the filter, make the request and pass data to callback()
        $.ajax({
            url: url,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            success: function (response, textStatus, jqXHR) {

                if (jqXHR.status !== 204) {

                    if (context) {
                        $.proxy(callback, context, response)();
                    } else {
                        callback(response);
                    }

                } else {
                    amplify.publish(E.SEARCH_QUERY_EMPTY_RESPONSE, {});
                }

            },
            data: JSON.stringify(plugin.getFilter()),
            complete: function () {
                amplify.publish(E.SEARCH_QUERY_END, {});
            }
        });
    };

    return Fx_catalog_bridge;

});