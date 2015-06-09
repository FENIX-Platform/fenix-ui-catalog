/*global amplify, define*/

define([
    "jquery",
    "fx-cat-br/utils/fenix-ui-creator",
    'fx-cat-br/config/fx-catalog-modular-form-config',
    'fx-cat-br/config/events',
    "fx-cat-br/widgets/Fx-widgets-commons",
    "amplify"
], function ($, UiCreator, config, E, W_Commons) {

    'use strict';

    var o = { },
        defaultOptions = {
            widget: {
                lang: 'EN'
            },
            css_classes: {
                HOLDER: "fx-catalog-modular-form-holder",
                HEADER: "fx-catalog-modular-form-header",
                HANDLER: "fx-catalog-modular-form-handler",
                CONTENT: "fx-catalog-modular-form-content",
                CLOSE_BTN: "fx-catalog-modular-form-close-btn",
                MODULE: 'fx-catalog-form-module',
                RESIZE: "fx-catalog-modular-form-resize-btn",
                LABEL: "fx-catalog-modular-form-label"
            },
            events: {
                REMOVE_MODULE: "fx.catalog.module.remove"
            }
        }, uiCreator, w_Commons, cache = {}, modules = [];

    var s = {
       HINTS_CONTAINER: '.fx-catalog-welcome'
    };

    function Fx_catalog_modular_form() {

        uiCreator = new UiCreator();
        uiCreator.init({
            plugin_folder: 'fx-cat-br/utils/fx-ui-w/',
            result_key : 'type'
        });
        w_Commons = new W_Commons();
    }

    //(injected)
    Fx_catalog_modular_form.prototype.grid = undefined;

    Fx_catalog_modular_form.prototype.removeItem = function (item) {
        this.grid.removeItem(item);
    };

    Fx_catalog_modular_form.prototype.getElementsCounts = function (){
        return this.grid.getElementsCounts();
    };

    Fx_catalog_modular_form.prototype.hideCourtesyMessage = function(){
        $(s.HINTS_CONTAINER).fadeOut(200);
    };

    Fx_catalog_modular_form.prototype.showCourtesyMessage = function(){
        $(s.HINTS_CONTAINER).fadeIn();
    };

    /*
    * @param module: obj.
    * The obj used to configure the collapsible menu. The attribute module.module
    * is used to discriminate what widgets must be rendered
    * */
    Fx_catalog_modular_form.prototype.addItem = function (module) {

        var blank = this.getBlankModule(module);

        this.grid.addItem(blank.get(0));

        this.renderModule(blank, module);

    };

    Fx_catalog_modular_form.prototype.renderModule = function ($blank, module) {

        var c = $blank.find("." + o.css_classes.CONTENT);

        var id = "fx-catalog-module-" + w_Commons.getFenixUniqueId(),
            m = {id: cache.json[module.module].id, type: module.module};
        c.attr("id", id);

        if (cache.json[module.module].hasOwnProperty("details")){ m.details = cache.json[module.module].details; }

        modules.push(m);

        console.log(cache.json[module.module])

        uiCreator.render({
            cssClass: "form-elements",
            container: "#" + id,
            elements: JSON.stringify([cache.json[module.module]])
        });

    };

    Fx_catalog_modular_form.prototype.getBlankModule = function (module) {

        var self = this;

        var $module = $("<div class='" + o.css_classes.MODULE + "'></div>"),
            $header = $("<div class='" + o.css_classes.HEADER + "'></div>"),
            $holder = $("<div class='" + o.css_classes.HOLDER + "'></div>");

        $module.attr("data-module", module.module);
        $module.attr("data-size", "half");
        $header.append("<div class='" + o.css_classes.HANDLER + "'></div>");
        $header.append("<div class='" + o.css_classes.LABEL + "'>" + cache.json[module.module].label[o.widget.lang] + "</div>");

        var $resize = $("<div class='" + o.css_classes.RESIZE + "'></div>");
        $resize.on("click", { module: $module.get(0), btn: $resize}, function (e) {

            if ($(e.data.module).attr("data-size") === 'half') {
                $(e.data.module).attr("data-size", "full");
                $(e.data.btn).css({
                    "background-position": "-30px -15px"
                });

            } else {
                $(e.data.module).attr("data-size", "half");
                $(e.data.btn).css({
                    "background-position": "-30px 0"
                });
            }

            self.grid.resize(e.data.module);
        });
        $header.append($resize);

        var $close_btn = $("<div class='" + o.css_classes.CLOSE_BTN + "'></div>")
            .on("click", { o: o }, function () {
                amplify.publish(E.MODULE_REMOVE, { type: module.module, module: $module.get(0)});

                for (var i = 0; i < modules.length; i++) {

                    if (modules[i].type === module.module) {
                        modules.splice(i, 1);
                    }
                }

            });

        $header.append($close_btn);
        $module.append($holder);
        $holder.append($header);
        $holder.append("<div class='" + o.css_classes.CONTENT + "'></div>");

        $(o.container).append($module);

        return $module;
    };

    Fx_catalog_modular_form.prototype.getValues = function (boolean) {
        return uiCreator.getValues(boolean, modules);
    };

    Fx_catalog_modular_form.prototype.initStructure = function () {

        this.grid.render();
    };

    Fx_catalog_modular_form.prototype.render = function (options) {

        $.extend(o, options);

        cache.json = $.extend(true, {}, config);

        this.initStructure();
    };

    Fx_catalog_modular_form.prototype.init = function (options) {

        $.extend(o, defaultOptions);

        $.extend(o, options);
    };

    Fx_catalog_modular_form.prototype.destroy = function () {

        $("." + o.css_classes.RESIZE).off();

        $("." + o.css_classes.CLOSE_BTN).off();

        this.grid.destroy();

    };

    return Fx_catalog_modular_form;

});