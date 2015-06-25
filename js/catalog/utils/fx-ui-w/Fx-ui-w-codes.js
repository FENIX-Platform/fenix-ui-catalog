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

    function Fx_ui_w_codes() {
    }

    Fx_ui_w_codes.prototype.render = function (e, container, opts) {

        var self = this;

        o.container = container;

        o.module = e;

        o.options = opts;

        this.$treeContainer = $('<div class="jstree-holder"></div>');

        this.$searchForm = $('<form onSubmit="return false"><input type="search" data-role="search" class="form-control"  /></form>');

        this.$container = $(container);

        this.$container.append(this.$searchForm).append(this.$treeContainer);

        this.$treeContainer.jstree({

            'core': {
                'data': function (node, cb) {
                    if (node.id === "#") {
                        self.getFirstCall(e, cb);
                    }
                    else {
                        self.getChildren(e, node, cb);
                    }
                },
                "multiple": true,
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
                    label: o.module.label.EN,
                    options: o.options
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

    Fx_ui_w_codes.prototype.validate = function (e) {

        if (!e.hasOwnProperty("source")) {

            throw new Error("ELEM_NOT_SOURCE");
        }

        return true;
    };

    Fx_ui_w_codes.prototype.processData = function (data) {

        var r = [];

        $(data).each(function (index, item) {
            r.push({"text": item.title.EN, "id": item.code, "children": false});
        });

        return r;
    };

    Fx_ui_w_codes.prototype.getFirstCall = function (o, cb) {

        var self = this,
            body;

        if (o.component.config) {
            body = $.extend(true, {uid: o.component.source.uid}, o.component.config);
        } else {
            body = {
                uid: o.component.source.uid,
                level: 1,
                levels: 1
            };
        }

        if (o.component.source.version) {
            body.version = o.component.source.version;
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: (C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS) + "/codes/filter",
            data: JSON.stringify(body),
            dataType: "json",
            success: function (data) {

                if (data) {
                    cb(self.processData(data));
                }
            },
            error: function () {
                alert("Fx_ui_w_codes error: impossible to load codelist");
            }
        });
    };

    Fx_ui_w_codes.prototype.getChildren = function (o, node, cb) {

        var self = this,
            body = {
                uid: o.component.source.uid,
                level: 1,
                levels: 2,
                codes: [node.id]
            };

        if (o.component.source.version) {
            body.version = o.component.source.version;
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: o.component.source.url,
            data: JSON.stringify(body),
            dataType: "json",
            success: function (data) {
                if (data) {
                    cb(self.processData(data[0].children || []));
                } else {
                    cb([]);
                }

            },
            error: function () {
                alert("Fx_ui_w_codes error: impossible to load codelist");
            }
        });
    };

    Fx_ui_w_codes.prototype.bindEventListeners = function () {

        var that = this;

        amplify.subscribe(E.MODULE_DESELECT + '.' + o.module.id, function (e) {

            that.deselectValue(e);
        });

    };

    Fx_ui_w_codes.prototype.deselectValue = function (obj) {

        this.$treeContainer.jstree('deselect_node', [obj.value]);

        this.$treeContainer.jstree(true).deselect_node([obj.value]);

    };

    Fx_ui_w_codes.prototype.getValue = function (e) {

        var codes = $("#" + e.id).find('.jstree-holder').jstree(true).get_selected(),
            uid = e.module.component.source.uid,
            version = e.module.component.source.version;

        return {
            codes: [{
                uid: uid,
                version: version,
                codes: codes
            }]
        };
    };

    return Fx_ui_w_codes;
})
;