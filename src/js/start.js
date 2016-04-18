/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'fx-catalog/config/errors',
    'fx-catalog/config/events',
    'fx-catalog/config/config',
    'fx-catalog/config/config-default',
    'fx-catalog/config/menu-config',
    'fx-catalog/config/selectors-registry',
    'text!fx-catalog/html/catalog.hbs',
    'i18n!fx-catalog/nls/catalog',
    'fx-filter/start',
    'q',
    'handlebars',
    'amplify',
    'bootstrap'
], function ($, _, log, ERR, EVT, C, CD, MenuConfig, SelectorsRegistry, Templates, i18nLabels, Filter, Q, Handlebars) {

    'use strict';

    var s = {
        CATALOG: "[data-role='catalog']",
        MENU: "[data-role='menu']",
        MENU_GROUPS: "[data-role='menu-group']",
        MENU_ITEMS: "[data-role='menu-item']",
        FILTER: "[data-role='filter']",
        SUMMARY: "[data-role='summary']",
        SUBMIT_BUTTON: "[data-role='submit']",
        RESET_BUTTON: "[data-role='reset']"
    };

    function Catalog(o) {
        log.info("FENIX catalog");
        log.info(o);

        $.extend(true, this, o, CD, C);

        this._registerHandlebarsHelpers();

        var valid = this._validateInput();

        if (valid === true) {

            this._attach();

            this._initVariables();

            this._initFilter();

            this._bindEventListeners();

            return this;

        } else {
            log.error("Impossible to create Catalog");
            log.error(valid)
        }
    }

    /**
     * Reset the view content
     * @return {null}
     */
    Catalog.prototype.reset = function () {

        log.info("Catalog reset");
    };

    /**
     * Clear the filter from all selectors
     * @return {null}
     */
    Catalog.prototype.clear = function () {

        log.info("Catalog " + this.id + " cleared successfully");
    };

    /**
     * pub/sub
     * @return {Object} filter instance
     */
    Catalog.prototype.on = function (channel, fn) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: this, callback: fn});
        return this;
    };

    // end API

    Catalog.prototype._trigger = function (channel) {

        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    };

    Catalog.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //set filter id
        if (!this.id) {

            window.fx_catalog_id >= 0 ? window.fx_catalog_id++ : window.fx_catalog_id = 0;

            this.id = "fx-catalog-" + String(window.fx_catalog_id);

            log.warn("Impossible to find catalog id. Set auto id to: " + this.id);
        }


        if (!this.$el) {
            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find filter container");
        }

        this.$el = $(this.$el);

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find box container");

        }

        return errors.length > 0 ? errors : valid;
    };

    Catalog.prototype._attach = function () {

        var template = Handlebars.compile($(Templates).find(s.CATALOG)[0].outerHTML),
            $html = $(template($.extend(true, {}, i18nLabels, this._createMenuConfiguration())));

        this.$el.html($html);

    };

    Catalog.prototype._createMenuConfiguration = function () {

        var groups = _.map(MenuConfig, _.bind(function (group) {

            //Add menu id
            group.menuId = this.id;

            //Add dynamic group id
            window.fx_catalog_menu_groups >= 0 ? window.fx_catalog_menu_groups++ : window.fx_catalog_menu_groups = 0;
            group.id = this.id + "-group-" + String(window.fx_catalog_menu_groups);
            group.opened = !!group.opened;

            //Iterate over group's items
            _.map(group.items, _.bind(function (item) {

                //Add dynamic item id
                window.fx_catalog_menu_items >= 0 ? window.fx_catalog_menu_items++ : window.fx_catalog_menu_items = 0;
                item.id = this.id + "-item-" + String(window.fx_catalog_menu_items);
                item.disabled = !!item.disabled;

            }, this));

            return group;

        }, this));

        return {menuId: this.id, groups: groups};
    };

    Catalog.prototype._initVariables = function () {

        //pub/sub
        this.channels = {};

        //menu
        this.$menu = this.$el.find(s.MENU);
        this.$items = this.$menu.find(s.MENU_ITEMS);

        this.$submit = this.$el.find(s.SUBMIT_BUTTON);
        this.$reset = this.$el.find(s.RESET_BUTTON);

    };

    Catalog.prototype._enableMenuItem = function (selector) {

        this._getMenuItemBySelector(selector).attr("disabled", false);
    };

    Catalog.prototype._disableMenuItem = function (selector) {

        this._getMenuItemBySelector(selector).attr("disabled", true);
    };

    Catalog.prototype._getMenuItemBySelector = function (selector) {

        return this.$items.filter("[data-selector='" + selector + "']");

    };

    Catalog.prototype._bindEventListeners = function () {

        var self = this;

        this.$items.on("click", function (e) {
            e.preventDefault();

            var selector = $(e.target).data("selector");

            self._disableMenuItem(selector);

            self._addSelector(selector);
        });

        this.$submit.on("click", _.bind(this._onSubmitClick, this));

        this.$reset.on("click", _.bind(this._onResetClick, this));

        this.filter.on('ready', _.bind(this._unlock, this));

        this.filter.on('remove', _.bind(function (item) {
            this._enableMenuItem(item.id);
        }, this));


        //amplify.subscribe(this._getEventName(EVT.SELECTORS_ITEM_SELECT), this, this._onSelectorItemSelect);
    };

    Catalog.prototype._unlock = function () {
        this.$submit.attr("disabled", false);
        this.$reset.attr("disabled", false);
    };

    Catalog.prototype._lock = function () {
        this.$submit.attr("disabled", true);
        this.$reset.attr("disabled", true);
    };

    Catalog.prototype._addSelector = function (selector) {

        if (!$.isFunction(this.filter.add)){
            log.error("Filter.add is not a fn()");
            return;
        }

        if (!SelectorsRegistry.hasOwnProperty(selector)){
            log.error("Impossible to find selector in registry: " + selector);
            return;
        }

        var config = {};
        config[selector] = $.extend(true, {}, SelectorsRegistry[selector]);

        this.filter.add(config);
    };

    Catalog.prototype._onSubmitClick = function () {
        alert("submit")
    };

    Catalog.prototype._onResetClick = function () {
        if (this.filter && !$.isFunction(this.filter.clear)) {
            log.error("Filter.clear is not a fn()");

            return;
        }

        this.filter.clear();
    };

    Catalog.prototype._initFilter = function () {

        this.filter = new Filter({
            $el: s.FILTER,
            summary$el: s.SUMMARY
        });
    };

    //Request

    Catalog.prototype._createPromise = function (obj) {

        var self = this,
            body = obj,
            key = this._getCodelistCacheKey(obj);

        return this._getPromise(body).then(function (result) {

            if (typeof result === 'undefined') {
                log.error("Code List loaded returned empty! id: " + key);
                log.warn('Add placeholder code list');

                self._storeCodelist(body, [{
                    code: "fake_code",
                    leaf: true,
                    level: 1,
                    rid: "fake_rid",
                    title: {
                        EN: "EMPTY_CODE_LIST :'("
                    }
                }]);

            } else {
                log.info("Code List loaded successfully for: " + key);
                self._storeCodelist(body, result);
            }

        }, function (r) {

            log.error(r);
        });
    };

    Catalog.prototype._getPromise = function (body) {

        return Q($.ajax({
            url: CD.SERVER + CD.CODELIST_SERVICE + CD.CODES_POSTFIX,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(body),
            dataType: 'json'
        }));

    };

    // Handlers


    Catalog.prototype._getEventName = function (evt) {

        return this.id.concat(evt);
    };

    //disposition
    Catalog.prototype._unbindEventListeners = function () {

        this.$items.off();

        this.$submit.off();

        this.$reset.off();

        //amplify.unsubscribe(this._getEventName(EVT.SELECTOR_READY), this._onSelectorReady);

    };

    Catalog.prototype.dispose = function () {

        //unbind event listeners
        this._unbindEventListeners();

    };

    Catalog.prototype._registerHandlebarsHelpers = function () {

        Handlebars.registerHelper('isOpened', function (opened) {
            return opened === true ? 'in' : '';
        });

    };

    return Catalog;
});