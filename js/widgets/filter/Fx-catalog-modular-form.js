/*global amplify, define*/

define([
    "jquery",
    "fx-cat-br/config/config",
    "fx-cat-br/config/config-default",
    "fx-cat-br/utils/fenix-ui-creator",
    'fx-cat-br/config/fx-catalog-modular-form-config',
    'fx-cat-br/config/events',
    "text!fx-cat-br/html/filter/blank_module.html",
    "fx-cat-br/widgets/Fx-widgets-commons",
    'handlebars',
    "amplify"
], function ($, C, DC, UiCreator, config, E, ModuleTemplate, W_Commons, Handlebars) {

    'use strict';

    var o = {},
        defaultOptions = {
            widget: {
                lang: 'EN'
            },
            s: {
                CONTENT: ".fx-catalog-modular-form-content",
                CLOSE_BTN: ".fx-catalog-modular-form-close-btn",
                RESIZE: ".fx-catalog-modular-form-resize-btn"

            }
        }, uiCreator, w_Commons, cache = {}, modules = [];

    var s = {
        HINTS_CONTAINER: '.fx-catalog-welcome'
    };

    function Fx_catalog_modular_form() {

        uiCreator = new UiCreator();
        uiCreator.init({
            plugin_folder: C.FX_UI_CREATOR_PLUGIN_FOLDER || DC.FX_UI_CREATOR_PLUGIN_FOLDER,
            result_key: 'semantic'
        });
        w_Commons = new W_Commons();
    }

    //(injected)
    Fx_catalog_modular_form.prototype.grid = undefined;

    Fx_catalog_modular_form.prototype.removeItem = function (item) {
        this.grid.removeItem(item);
    };

    Fx_catalog_modular_form.prototype.getElementsCounts = function () {
        return this.grid.getElementsCounts();
    };

    Fx_catalog_modular_form.prototype.hideCourtesyMessage = function () {
        $(s.HINTS_CONTAINER).fadeOut(200);
    };

    Fx_catalog_modular_form.prototype.showCourtesyMessage = function () {
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

        var c = $blank.find(o.s.CONTENT);

        var id = "fx-catalog-module-" + w_Commons.getFenixUniqueId(),
            m = {
                id: id,
                type: cache.json[module.module].type,
                semantic: module.module,
                module: cache.json[module.module]
            };

        c.attr("id", id);

        if (cache.json[module.module].hasOwnProperty("details")) {
            m.details = cache.json[module.module].details;
        }

        modules.push(m);

        uiCreator.render({
            cssClass: "form-elements",
            container: "#" + id,
            module: $blank,
            type: module.module,
            elements: JSON.stringify([cache.json[module.module]])
        });

    };

    Fx_catalog_modular_form.prototype.getBlankModule = function (module) {

        var self = this;

        var template = Handlebars.compile(ModuleTemplate);

        var context = {
            dataModule: module.module,
            label: cache.json[module.module].label[o.widget.lang]
        };

        var $module = $(template(context)),
            $resizeBtn = $module.find(o.s.RESIZE),
            $close_btn = $module.find(o.s.CLOSE_BTN);

        $resizeBtn.on("click", function (e) {

            if ($module.attr("data-size") === 'half') {
                $module.attr("data-size", "full");
                $resizeBtn.css({
                    "background-position": "-30px -15px"
                });

            } else {
                $module.attr("data-size", "half");
                $resizeBtn.css({
                    "background-position": "-30px 0"
                });
            }

            self.grid.resize($module);
        });


        $close_btn.on("click", function () {

            amplify.publish(E.MODULE_REMOVE, {
                id: cache.json[module.module].id,
                type: module.module,
                module: $module.get(0)
            });

        });


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

        this.bindEventListeners();

        this.initStructure();
    };

    Fx_catalog_modular_form.prototype.bindEventListeners = function () {

        amplify.subscribe(E.MODULE_REMOVE, function (e) {

            for (var i = 0; i < modules.length; i++) {
                if (modules[i].semantic === e.type) {
                    modules.splice(i, 1);
                }
            }
        });

    };

    Fx_catalog_modular_form.prototype.init = function (options) {

        $.extend(o, defaultOptions, options);

    };

    Fx_catalog_modular_form.prototype.destroy = function () {
        $("." + s.RESIZE).off();
        $("." + s.CLOSE_BTN).off();

        this.grid.destroy();
    };

    return Fx_catalog_modular_form;

});