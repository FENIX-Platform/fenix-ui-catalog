define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons",
    "jqwidgets"
], function ($, W_Commons ) {

    var o = {
        lang : 'EN',
        events: {
            READY : "fx.catalog.module.ready" ,
            DESELECT: 'fx.catalog.module.deselect.'
        }
    }, w_commons;

    function Fx_ui_w_geographicExtent() {
        w_commons = new W_Commons();
    }

    Fx_ui_w_geographicExtent.prototype.validate = function (e) {
        if (!e.hasOwnProperty("source")) {
            throw new Error("ELEM_NOT_SOURCE");
        } else {
            if (!e.source.hasOwnProperty("datafields")) {
                throw new Error("ELEM_NOT_DATAFIELDS");
            }
        }

        return true;
    };

    Fx_ui_w_geographicExtent.prototype.render = function (e, container) {

        o.container = container;
        o.module = e;

        var source, dataAdapter, that = this;

        $.get( e.component.source.url, function( data ){

            // prepare the data
            source = {datatype: "array"};
            source["datafields"] = e.component.source["datafields"];
            source["id"] = e.component.source["id"];
            source["localdata"] = data.sort(function(a, b){
                if ( a.title.EN < b.title.EN )
                    return -1;
                if ( a.title.EN > b.title.EN )
                    return 1;
                return 0;
            });

            // prepare the data
            dataAdapter = new $.jqx.dataAdapter(source, {
                loadError: function (jqXHR, status, error) {
                    throw new Error("CONNECTION_FAIL");
                }
            });

            // Create a jqxListBox
            $(container).jqxListBox($.extend({ source: dataAdapter}, e.component.rendering))
                .on('change', {container: container }, function (event) {
                    var selected = $(event.data.container).jqxListBox("getSelectedItems"),
                        payload = [];

                        for(var i=0; i<selected.length; i++){
                            payload.push({label: selected[i].label, value:  selected[i].value })
                        }

                    w_commons.raiseCustomEvent(
                        o.container,
                        o.events.READY,
                        { value: payload,
                            module: o.module.type }
                    );
                });

            that.bindEventListeners();

        }) ; // end GET


    };


    Fx_ui_w_geographicExtent.prototype.bindEventListeners = function () {

        var that = this;

        document.body.addEventListener(o.events.DESELECT+o.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);
    };

    Fx_ui_w_geographicExtent.prototype.deselectValue = function (obj) {
        var item = $(o.container).jqxListBox('getItemByValue', obj.value);
        $(o.container).jqxListBox('unselectItem', item );
    };

    Fx_ui_w_geographicExtent.prototype.getValue = function (e) {
        var codes = $("#" + e.id).jqxListBox('val').split(','),
            system = e.details.cl.system,
            version = e.details.cl.version,
            results = [];

        for (var i = 0 ; i < codes.length; i++){
            results.push({code: {code : codes[i], systemKey : system, systemVersion:version}});
        }

        return results;
    };

    return Fx_ui_w_geographicExtent;
});