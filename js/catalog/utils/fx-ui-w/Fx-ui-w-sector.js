define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons",
    "jqwidgets"
], function ($, W_Commons) {

    var o = {
        lang: 'EN',
        events: {
            READY: "fx.catalog.module.ready",
            DESELECT: 'fx.catalog.module.deselect.'
        }
    }, w_commons;

    function Fx_ui_w_referenceArea() {
        w_commons = new W_Commons();
    }

    Fx_ui_w_referenceArea.prototype.validate = function (e) {

        if (!e.hasOwnProperty("source")) {
            throw new Error("ELEM_NOT_SOURCE");
        }

        return true;
    };

    Fx_ui_w_referenceArea.prototype.bindEventListeners = function () {

        var that = this;

        document.body.addEventListener(o.events.DESELECT + o.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);
    };

    Fx_ui_w_referenceArea.prototype.render = function (e, container) {

        o.container = container;
        o.module = e;

        this.bindEventListeners();
        this.getCodelist();

    };

    Fx_ui_w_referenceArea.prototype.getCodelist = function () {

        var body = {
            uid: o.module.component.source.uid,
            version: o.module.component.source.version
        };

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: o.module.component.source.url,
            data: JSON.stringify(body),
            dataType: "json",
            success: $.proxy(this.printList, this),
            error: function () {
                alert("Fx_ui_w_referenceArea error: impossible to load codelist");
            }
        });

    };

    Fx_ui_w_referenceArea.prototype.printList = function (data) {

        var source = $.extend({datatype: "json",  localdata: data}, o.module.component.source);
        var dataAdapter = new $.jqx.dataAdapter(source);

        $(o.container).jqxListBox($.extend({ source: dataAdapter}, o.module.component.rendering))
            .on('change', {container: o.container }, function (event) {
                var selected = $(event.data.container).jqxListBox("getSelectedItems"),
                    payload = [];

                for (var i = 0; i < selected.length; i++) {
                    payload.push({label: selected[i].label, value: selected[i].value })
                }

                w_commons.raiseCustomEvent(
                    o.container,
                    o.events.READY,
                    { value: payload,
                        module: o.module.type }
                );
            });

    };

    Fx_ui_w_referenceArea.prototype.deselectValue = function (obj) {
        var item = $(o.container).jqxListBox('getItemByValue', obj.value);
        $(o.container).jqxListBox('unselectItem', item);
    };

    Fx_ui_w_referenceArea.prototype.getValue = function (e) {
        var codes = $("#" + e.id).jqxListBox('val').split(','),
            system = e.details.cl.system,
            version = e.details.cl.version,
            results = [];

        for (var i = 0; i < codes.length; i++) {
            results.push({code: {code: codes[i], systemKey: system, systemVersion: version}});
        }

        return results;
    };

    return Fx_ui_w_referenceArea;
});