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

    function Fx_ui_w_resourceType() {
        w_commons = new W_Commons();
    }

    Fx_ui_w_resourceType.prototype.validate = function (e) {

        if (!e.hasOwnProperty("source")) {
            throw new Error("ELEM_NOT_SOURCE");
        }

        return true;
    };

    Fx_ui_w_resourceType.prototype.bindEventListeners = function () {

        var that = this;

        document.body.addEventListener(o.events.DESELECT + o.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);
    };

    Fx_ui_w_resourceType.prototype.render = function (e, container) {

        o.container = container;
        o.module = e;

        this.bindEventListeners();
        this.getCodelist();

    };

    Fx_ui_w_resourceType.prototype.getCodelist = function () {

        $.get(o.module.component.source.url, $.proxy(this.onGetCodelistSuccess, this))
            .fail(function () {
                alert("Fx_ui_w_resourceType error: impossible to load codelist");
            });

    };

    Fx_ui_w_resourceType.prototype.onGetCodelistSuccess = function (d) {

        var array = [],
            keys = Object.keys(d);

        for (var i = 0; i < keys.length; i++) {
            array.push({value: keys[i], label: d[keys[i]][o.lang] })
        }

        this.printList(array);
    };

    Fx_ui_w_resourceType.prototype.printList = function (data) {

        var source = {
            datatype: "json",
            datafields: [
                { "name": "label"},
                { "name": "value" }
            ],
            id: 'value',
            localdata: data
        };
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

    Fx_ui_w_resourceType.prototype.deselectValue = function (obj) {
        var item = $(o.container).jqxListBox('getItemByValue', obj.value);
        $(o.container).jqxListBox('unselectItem', item);
    };

    Fx_ui_w_resourceType.prototype.getValue = function (e) {

        return {enumeration : $("#" + e.id).jqxListBox('val').split(',')};
    };

    return Fx_ui_w_resourceType;
});