/*global define, amplify */

define([
    'jquery',
    "fx-cat-br/plugins/Fx-catalog-brigde-filter-plugin"
], function ($, Plugin) {

    'use strict';

    var o = {
            name: 'fx-catalog-filter',
            events: {
                SELECT: "fx.catalog.module.select",
                REMOVE: "fx.catalog.module.remove"
            }
        };

    var selectors = {
        CONTAINER: ".fx-catalog-modular-filter-container",
        TOGGLE_BTN: ".fx-catalog-header-btn-close"
    };

    function FilterController() {

        this.publishFxCatalogBridgePlugin();

        //workaround to unbind listeners
       /* this.onItemSelect = $.proxy(this.onItemSelect, this);
        this.onItemRemove = $.proxy(this.onItemRemove, this);
        this.onSubmit = $.proxy(this.onSubmit, this);*/
    }

    FilterController.prototype.publishFxCatalogBridgePlugin = function () {

        //FENIX Catalog Plugin Registration
        if (!window.Fx_catalog_bridge_plugins) {
            window.Fx_catalog_bridge_plugins = {};
        }
        window.Fx_catalog_bridge_plugins[o.name] = new Plugin();

    };

    //(injected)
    FilterController.prototype.menu = undefined;

    //(injected)
    FilterController.prototype.form = undefined;

    //(injected)
    FilterController.prototype.resume = undefined;

    //(injected)
    FilterController.prototype.submit = undefined;

    /* API */
    FilterController.prototype.render = function () {

        this.preValidation();
        this.bindEventListeners();

        this.renderComponents();
    };

    FilterController.prototype.preValidation = function () {

        if (!this.menu) {
            throw new Error("FilterController: INVALID MENU ITEM.");
        }
        if (!this.form) {
            throw new Error("FilterController: INVALID FORM ITEM.");
        }
        if (!this.submit) {
            throw new Error("FilterController: INVALID SUBMIT ITEM.");
        }

    };

    FilterController.prototype.bindEventListeners = function () {

        amplify.subscribe(o.events.SELECT, this, this.onItemSelect);
        amplify.subscribe(o.events.REMOVE, this, this.onItemRemove);


/*
        document.body.addEventListener(o.events.SELECT, this.onItemSelect);

        document.body.addEventListener(o.events.REMOVE, this.onItemRemove);
*/

        $(selectors.TOGGLE_BTN).on('click', this.onToggleCatalog);

        $(this.submit).on("click", this.onSubmit);
    };

    FilterController.prototype.unbindEventListeners = function () {

        amplify.unsubscribe(o.events.SELECT, this.onItemSelect);
        amplify.unsubscribe(o.events.REMOVE, this.onItemRemove);
/*
        document.body.removeEventListener(o.events.SELECT, this.onItemSelect);

        document.body.removeEventListener(o.events.REMOVE, this.onItemRemove);*/

        $(selectors.TOGGLE_BTN).off();

        $(this.submit).off('click', this.onSubmit);
    };

    FilterController.prototype.getD3PFilter = function () {
        return {
            hi : "I am the filter"
        };
    };

    /* event callback */

    FilterController.prototype.onItemSelect = function (e) {

        if (this.form.getElementsCounts() === 0) {
            this.form.hideCourtesyMessage();
            this.resume.hideCourtesyMessage();
            $(this.submit).removeClass('disabled');
        }

        this.form.addItem(e);

    };

    FilterController.prototype.onItemRemove = function (e) {
        this.form.removeItem(e.module);
        this.menu.activate(e.type);

        if (this.form.getElementsCounts() === 0) {
            this.form.showCourtesyMessage();
            this.resume.showCourtesyMessage();
            $(this.submit).addClass('disabled');
        }
    };

    FilterController.prototype.onToggleCatalog = function () {

        if ($(selectors.CONTAINER).is(":visible")) {
            $(selectors.CONTAINER).hide();
        } else {
            $(selectors.CONTAINER).show();
        }

    };

    FilterController.prototype.onSubmit = function () {

        amplify.publish('fx.catalog.submit');
    };

    /* end event callback */

    FilterController.prototype.renderComponents = function () {

        this.menu.render();
        this.form.render();
        this.resume.render();
    };

    FilterController.prototype.getValues = function (boolean) {
        return this.form.getValues(boolean);
    };

    FilterController.prototype.getName = function () {
        return o.name;
    };

    FilterController.prototype.destroy = function () {

        this.menu.destroy();

        this.form.destroy();

        this.resume.destroy();

        this.unbindEventListeners();
    };

    return FilterController;

});