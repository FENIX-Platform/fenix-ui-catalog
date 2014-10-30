define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons",
    "jstree"
], function ($, W_Commons) {

    var o = {
        lang : 'EN',
        events: {
            READY : "fx.catalog.module.ready",
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

    Fx_ui_w_geographicExtent.prototype.processData = function ( data ){

        var r = [];

        $(data).each(function (index, item) {

           r.push({"text" : item.title.EN, "id" : item.code, "children" : true});
        });

        return r;
    };

    Fx_ui_w_geographicExtent.prototype.getFirstCall = function (o, cb ) {

        var self =this;

        $.get( o.component.source.url, function( data ){

            cb(self.processData(data));
        });
    };

    Fx_ui_w_geographicExtent.prototype.getChildren = function (o, node, cb ) {

        var self =this;

        $.get( o.component.source.url + '/' + node.id + '?levels=1', function( data ){

            cb(self.processData(data.childs));
        });
    };

    Fx_ui_w_geographicExtent.prototype.render = function (e, container) {

        var self = this;

        o.container = container;
        o.module = e;

        this.$treeContainer = $('<div class="jstree-holder"></div>');
        this.$searchForm = $('<form id="s"><input type="search" id="q" /><input class="sel_all" type="button" value="sel all"><input class="desel_all" type="button" value="desel all"></form>');

        this.$container = $(container);
        this.$container.append(this.$searchForm);
        this.$container.append(this.$treeContainer);

        this.$treeContainer.jstree({

            'core' : {
                'data' : function (node, cb) {
                    if(node.id === "#") {
                        self.getFirstCall(e, cb);
                    }
                    else {
                        self.getChildren(e, node, cb);
                    }
                }
            },
            "plugins" : ["checkbox", "wholerow", "search"],
            "search" : {
                show_only_matches: true
            }
        });

        var to = false;
        this.$searchForm.find('#q').keyup(function () {
            if(to) { clearTimeout(to); }
            to = setTimeout(function () {
                var v =self.$searchForm.find('#q').val();
                self.$treeContainer.jstree(true).search(v);
            }, 250);
        });

        this.$treeContainer.on("changed.jstree", function (e, data) {

            var i, j, r = [];
            for(i = 0, j = data.selected.length; i < j; i++) {
                r.push({label: data.instance.get_node(data.selected[i]).text, value:data.instance.get_node(data.selected[i])});
            }

            w_commons.raiseCustomEvent(
                o.container,
                o.events.READY,
                { value: r,
                    module: o.module.type }
            );
        });

        this.$searchForm.find('.sel_all').on('click', function(){
           self.$treeContainer.jstree(true).select_all();
        });

        this.$searchForm.find('.desel_all').on('click', function(){
            self.$treeContainer.jstree(true).deselect_all();
        });

        this.bindEventListeners();

    };

    Fx_ui_w_geographicExtent.prototype.bindEventListeners = function () {

        var that = this;

        document.body.addEventListener(o.events.DESELECT+o.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);
    };

    Fx_ui_w_geographicExtent.prototype.deselectValue = function (obj) {
        this.$treeContainer.jstree('deselect_node',[ obj.value]);
        this.$treeContainer.jstree(true).deselect_node([ obj.value]);


    };

    Fx_ui_w_geographicExtent.prototype.getValue = function (e) {

        var codes = $("#" + e.id).find('.jstree-holder').jstree(true).get_selected(),
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