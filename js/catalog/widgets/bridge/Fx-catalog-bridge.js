/*global define */

define([
    "jquery",
    "amplify"
], function ($) {

    var o = { },
        defaultOptions = {
            error_prefix: "Fx_catalog_bridge ERROR: ",
            //url: 'http://faostat3.fao.org/d3s2/v2/msd/resources/find/',
            url:'http://fenix.fao.org/d3s_dev/msd/resources/find',
            events: {
                END : "fx.catalog.query.end",
                EMPTY_RESPONSE: "fx.catalog.query.empty_response"
            }
        }, plugin;

    function Fx_catalog_bridge() {

    }

    Fx_catalog_bridge.prototype.init = function (options) {

        //Merge options
        $.extend(o, defaultOptions);
        $.extend(o, options);

        return this;
    };

    Fx_catalog_bridge.prototype.query = function (src, callback, context) {


        if (!window.Fx_catalog_bridge_plugins || typeof window.Fx_catalog_bridge_plugins !== "object") {
            throw new Error(o.error_prefix + " Fx_catalog_bridge_plugins plugins repository not valid.");
        } else {
            plugin = window.Fx_catalog_bridge_plugins[src.getName()];
        }

        if (!plugin) {
            throw new Error(o.error_prefix + " plugin not found.")
        }

        if (typeof plugin.init !== "function") {
            throw new Error(o.error_prefix + " plugin for " + src.getName() + " does not have a public init() method.");
        } else {
            plugin.init($.extend({component: src}, o));
        }

        if (typeof callback !== "function") {
            throw new Error(o.error_prefix + " callback param is not a function");
        } else {

            if (o.blankFilter){
                this.getCustomBlankFilter(callback, context)
            }  else {
                this.performQuery(callback, context);
            }

        }
    };

    Fx_catalog_bridge.prototype.getCustomBlankFilter = function (callback, context){

        var self = this;

        $.getJSON(o.blankFilter, function (data) {

            plugin.init({blankFilter: data});
            self.performQuery(callback, context);
        })

    };

    Fx_catalog_bridge.prototype.performQuery = function (callback, context) {

        //Ask the plugin the filter, make the request and pass data to callback()
        $.ajax({
            url: o.url,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            success: function (response, textStatus, jqXHR ) {

                if(jqXHR.status !== 204){

                    if (context) {
                        $.proxy(callback, context, response)();
                    } else {
                        callback(response)
                    }

                } else {

                    amplify.publish( o.events.EMPTY_RESPONSE,  { });

                }

            },
            data: JSON.stringify(plugin.getFilter()),
            complete: function(){
                amplify.publish( o.events.END,  { });


            }
        });
    };



    return Fx_catalog_bridge;

});