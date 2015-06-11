/* global define, amplify */
define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons",
    'fx-cat-br/config/fx-catalog-collapsible-menu-config',
    'fx-cat-br/config/events',
    "text!fx-cat-br/html/filter/menu.html",
    'handlebars',
    'bootstrap',
    'amplify'
], function ($, W_Commons, conf, E, MenuTemplate, Handlebars) {

    'use strict';

    var o = {},
        defaultOptions = {
            widget: {
                lang: 'EN'
            }
        };

    var cache = {},
        w_Commons, $collapse;

    function Fx_Catalog_Collapsible_Menu() {
        w_Commons = new W_Commons();
    }

    Fx_Catalog_Collapsible_Menu.prototype.init = function (options) {

        //Merge options
        $.extend(o, defaultOptions, options);

    };

    Fx_Catalog_Collapsible_Menu.prototype.initVariables = function () {

        this.$container = $(o.container);
    };

    Fx_Catalog_Collapsible_Menu.prototype.render = function (options) {

        $.extend(o, options);

        cache.json = $.extend(true, {}, conf);

        this.initVariables();

        this.initStructure();

        this.renderMenu();

    };

    Fx_Catalog_Collapsible_Menu.prototype.initStructure = function () {

        o.collapseId = "fx-collapse-" + w_Commons.getFenixUniqueId();

        $collapse = $('<div class="panel-group" id="accordion"></div>');

        $collapse.attr("id", o.collapseId);

        this.$container.append($collapse);

    };

    Fx_Catalog_Collapsible_Menu.prototype.renderMenu = function () {

        if (cache.json.hasOwnProperty("panels")) {

            var panels = cache.json.panels;

            for (var i = 0; i < panels.length; i++) {
                $collapse.append(this.buildPanel(panels[i]));
            }

            this.$container.append($collapse);

        } else {
            throw new Error("Fx_Catalog_Collapsible_Menu: no 'panels' attribute in config JSON.");
        }
    };

    Fx_Catalog_Collapsible_Menu.prototype.buildPanel = function (panel) {

        var id = "fx-collapse-panel-" + w_Commons.getFenixUniqueId(),
            $p = $(document.createElement("DIV"));

        $p.addClass("panel");

        $p.addClass("panel-default");

        $p.append(this.buildPanelHeader(panel, id));

        $p.append(this.buildPanelBody(panel, id));

        return $p;
    };

    Fx_Catalog_Collapsible_Menu.prototype.buildPanelHeader = function (panel, id) {

        var template = Handlebars.compile(MenuTemplate);
        var context = {href: '#' + id,
            parent : o.collapseId,
            title: panel.title[o.widget.lang]
        };

        return $(template(context));

    };

    Fx_Catalog_Collapsible_Menu.prototype.buildPanelBody = function (panel, id) {

        //Init panel body
        var $bodyContainer = $("<div class='panel-collapse collapse'></div>");
        $bodyContainer.attr("id", id);

        var $body = $('<div class="panel-body"></div>');

        if (panel.hasOwnProperty("modules")) {
            var modules = panel.modules;

            for (var j = 0; j < modules.length; j++) {

                var $module = $("<div></div>"),
                    $btn = $('<button type="button" class="btn btn-default btn-block"></button>');

                $btn.on('click', {module: modules[j]}, function (e) {

                    var $btn = $(this);

                    if ($btn.is(':disabled') === false) {
                        $btn.attr("disabled", "disabled");
                        amplify.publish(E.MODULE_SELECT, e.data.module);
                    }

                });

                if (modules[j].hasOwnProperty("id")) {
                    $btn.attr("id", modules[j].id);
                }

                if (modules[j].hasOwnProperty("module")) {
                    $btn.attr("data-module", modules[j].module);
                }

                //Keep it before the label to have the icon in its the left side
                if (modules[j].hasOwnProperty("icon")) {
                    $btn.append($('<span class="' + modules[j].icon + '"></span>'));
                }

                if (modules[j].hasOwnProperty("label")) {

                    $btn.append(modules[j].label[o.widget.lang]);
                }

                 /*

                 if (modules[j].hasOwnProperty("popover")) {

                 console.log(modules[j]["popover"])
                 var keys = Object.keys(modules[j]["popover"]);

                 for (var k = 0; k < keys.length; k++ ){

                 $btn.attr(keys[k], modules[j]["popover"][keys[k]])
                 }

                 }
                 */

                $module.append($btn);
                $body.append($module);
            }
        }

        return $bodyContainer.append($body);
    };

    Fx_Catalog_Collapsible_Menu.prototype.disable = function (module) {

        this.$container.find("[data-module='" + module + "']").attr("disabled", "disabled");
    };

    Fx_Catalog_Collapsible_Menu.prototype.activate = function (module) {

        this.$container.find("[data-module='" + module + "']").removeAttr("disabled");
    };

    Fx_Catalog_Collapsible_Menu.prototype.destroy = function () {

        this.$container.find('button.btn.btn-default.btn-block').off();

    };

    return Fx_Catalog_Collapsible_Menu;

});