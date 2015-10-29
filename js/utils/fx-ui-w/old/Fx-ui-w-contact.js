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
        $(o.container).append($('<div data-role="list"></div>'));
        $(o.container).append($('<div data-role="text"></div>'));
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

        $(o.container).find('[data-role="list"]').jqxListBox($.extend({ source: dataAdapter}, o.module.component.rendering))
            .on('change', {container:  $(o.container).find('[data-role="list"]') }, function (event) {
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

        this.printText();
    };

    Fx_ui_w_resourceType.prototype.printText = function () {

        var text = document.createElement('INPUT');
        text.setAttribute("type", "TEXT");

       /* if (e.component.hasOwnProperty("rendering")) {
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

        }*/

        text.setAttribute("placeholder", 'Contact');


        $(text).focusout( {w_commons : w_commons, type: o.module.type }, function(e){

            var payload = {},
                raw = this.getValue();


            w_commons.raiseCustomEvent(
                o.container,
                o.events.READY,
                { value: payload,
                    module:  e.data.type}
            );


        });

        $(o.container).find(['data-role="text']).append(text);

    };

    Fx_ui_w_resourceType.prototype.deselectValue = function (obj) {
        var item =$(o.container).find('[data-role="list"]').jqxListBox('getItemByValue', obj.value);
        $(o.container).find('[data-role="list"]').jqxListBox('unselectItem', item);
    };

    Fx_ui_w_resourceType.prototype.getValue = function (e) {

        return {enumeration: $("#" + e.id).find('[data-role="list"]').jqxListBox('val').split(',')};
    };

    return Fx_ui_w_resourceType;
});