/*global define */

define([
    "fx-cat-br/plugins/Fx-catalog-brigde-filter-plugin",
    "fx-cat-br/widgets/Fx-widgets-commons"
], function (Plugin, W_Commons) {

    var w_Commons,
        o = {
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
        this.onItemSelect = $.proxy(this.onItemSelect, this);
        this.onItemRemove = $.proxy(this.onItemRemove, this);
        this.onSubmit = $.proxy(this.onSubmit, this);

        w_Commons = new W_Commons();
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
            throw new Error("FilterController: INVALID MENU ITEM.")
        }
        if (!this.form) {
            throw new Error("FilterController: INVALID FORM ITEM.")
        }
        if (!this.submit) {
            throw new Error("FilterController: INVALID SUBMIT ITEM.")
        }
        if (!w_Commons.isNode(this.submit)) {
            throw new Error("FilterController: SUBMIT NOT DOM NODE.")
        }

    };

    FilterController.prototype.bindEventListeners = function () {

        document.body.addEventListener(o.events.SELECT, this.onItemSelect);

        document.body.addEventListener(o.events.REMOVE, this.onItemRemove);

        $(selectors.TOGGLE_BTN).on('click', this.onToggleCatalog);

        $(this.submit).on("click", this.onSubmit);
    };

    FilterController.prototype.unbindEventListeners = function () {

        document.body.removeEventListener(o.events.SELECT, this.onItemSelect);

        document.body.removeEventListener(o.events.REMOVE, this.onItemRemove);

        $(selectors.TOGGLE_BTN).off();

        $(this.submit).off('click', this.onSubmit);
    };

    /* event callback */

    FilterController.prototype.onItemSelect = function (e) {

        if (this.form.getElementsCounts() === 0) {
            this.form.hideCourtesyMessage();
            this.resume.hideCourtesyMessage();
            $(this.submit).removeClass('disabled');
        }
        this.form.addItem(e.detail);

    };

    FilterController.prototype.onItemRemove = function (e) {
        this.form.removeItem(e.detail.module);
        this.menu.activate(e.detail.type);

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

        w_Commons.raiseCustomEvent(this.submit, "submit.catalog.fx", {});
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