/*global define, amplify, alert*/

define([
    "jquery",
    "fx-cat-br/config/config",
    "fx-cat-br/config/config-default",
    "fx-cat-br/config/events",
    "jstree",
    "amplify"
], function ($, C, DC, E) {

    'use strict';

    var o = {
        lang: 'EN'
    };

    function Fx_ui_w_enumeration() {

    }

    Fx_ui_w_enumeration.prototype.render = function (e, container, opts) {

        var self = this;

        o.module = e;

        o.options = opts;

        this.$treeContainer = $('<div class="jstree-holder"></div>');

        this.$searchForm = $('<form onSubmit="return false"><input type="search" data-role="search" class="form-control"  /></form>');

        this.$container = $(container);

        this.$container.append(this.$searchForm);

        this.$container.append(this.$treeContainer);

        this.$treeContainer.jstree({

            'core': {
                'data': function (node, cb) {
                    if (node.id === "#") {
                        self.getFirstCall(e, cb);
                    }
                },
                "multiple": false,
                "animation": 0,
                "themes": {"stripes": true}
            },
            "plugins": ["checkbox", "wholerow", "search"],
            "search": {
                show_only_matches: true
            }
        });

        var to = false;

        this.$searchForm.find('[data-role="search"]').keyup(function () {

            if (to) {
                clearTimeout(to);
            }

            to = setTimeout(function () {
                var v = self.$searchForm.find('[data-role="search"]').val();
                self.$treeContainer.jstree(true).search(v);
            }, 250);
        });

        this.$treeContainer.on("changed.jstree", function (e, data) {

            var i, j, r = [];

            for (i = 0, j = data.selected.length; i < j; i++) {

                r.push({
                    label: data.instance.get_node(data.selected[i]).text,
                    value: data.instance.get_node(data.selected[i])
                });
            }

            amplify.publish(E.MODULE_READY,
                {
                    value: r,
                    id: o.module.id,
                    label :  o.module.label.EN,
                    options : o.options
                });
        });

        this.$searchForm.find('.sel_all').on('click', function () {
            self.$treeContainer.jstree(true).select_all();
        });

        this.$searchForm.find('.desel_all').on('click', function () {
            self.$treeContainer.jstree(true).deselect_all();
        });

        this.bindEventListeners();

    };

    Fx_ui_w_enumeration.prototype.validate = function (e) {

        if (!e.hasOwnProperty("source")) {

            throw new Error("ELEM_NOT_SOURCE");
        }

        return true;
    };

    Fx_ui_w_enumeration.prototype.processData = function (data) {

        var r = [],
            keys = Object.keys(data);

        $(keys).each(function (index, item) {
            r.push({"text": data[item].EN, "id": item, "children": false});
        });

        return r;
    };

    Fx_ui_w_enumeration.prototype.getFirstCall = function (o, cb) {

        var self = this;

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: (C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS) + "/choices/" +  o.component.source.uid,
            dataType: "json",
            success: function (data) {

                if (data) {
                    cb(self.processData(data));
                }

            },
            error: function () {
                alert("Fx_ui_w_enumeration error: impossible to load codelist");
            }
        });
    };

    Fx_ui_w_enumeration.prototype.bindEventListeners = function () {

        var that = this;

        amplify.subscribe(E.MODULE_DESELECT + '.' + o.module.id, function (e) {

            that.deselectValue(e);
        });

    };

    Fx_ui_w_enumeration.prototype.deselectValue = function (obj) {

        this.$treeContainer.jstree('deselect_node', [obj.value]);

        this.$treeContainer.jstree(true).deselect_node([obj.value]);
    };

    Fx_ui_w_enumeration.prototype.getValue = function (e) {

        var codes = $("#" + e.id).find('.jstree-holder').jstree(true).get_selected();

        return {enumeration : codes};


    };

    return Fx_ui_w_enumeration;
});