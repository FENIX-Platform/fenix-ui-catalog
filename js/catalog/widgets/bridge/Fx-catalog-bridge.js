/*global define, amplify */

define([
    "jquery",
    'fx-cat-br/config/config',
    'fx-cat-br/config/config-default',
    "amplify"
], function ($, C, DC) {

    'use strict';

    var o = {},
        defaultOptions = {
            error_prefix: "Fx_catalog_bridge ERROR: ",
            //url: 'http://faostat3.fao.org/d3s2/v2/msd/resources/find/',
            //url: 'http://fenix.fao.org/d3s_dev/msd/resources/find',
            url: 'http://fenix.fao.org/d3s_fenix/msd/resources/find',
            events: {
                END: "fx.catalog.query.end",
                EMPTY_RESPONSE: "fx.catalog.query.empty_response"
            }
        }, plugin;

    function Fx_catalog_bridge() {

    }

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
            //Daniele:allow passig configurations from the main config files
            /*
            if (o.blankFilter) {
                this.getCustomBlankFilter(callback, context);
            } else {
                this.performQuery(callback, context);
            }
            */
            this.getCustomBlankFilter(callback, context);
        }
    };

    //Daniele: Always call the getCustomBlankFilter, merge it with the global config then perform the query
    Fx_catalog_bridge.prototype.getCustomBlankFilter = function (callback, context) {

        var self = this;

        var blankF = C.CATALOG_BLANK_FILTER || DC.CATALOG_BLANK_FILTER;
        blankF = blankF || o.blankFilter;

        //$.getJSON(o.blankFilter, function (data) {
        if (blankF) {
            $.getJSON(blankF, function (data) {

                plugin.init({ blankFilter: data });
                self.performQuery(callback, context);
            });
        }
        else {
            this.performQuery(callback, context);
        }
    };

    Fx_catalog_bridge.prototype.performQuery = function (callback, context) {
        var SERVICE_PREFIX = C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS;
        var url = SERVICE_PREFIX + "/resources/find";

        //Ask the plugin the filter, make the request and pass data to callback()
        $.ajax({
            //url: o.url,
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
                    amplify.publish(o.events.EMPTY_RESPONSE, {});
                }

            },
            data: JSON.stringify(plugin.getFilter()),
            complete: function () {
                amplify.publish(o.events.END, {});
            }
        });
    };


    return Fx_catalog_bridge;

});