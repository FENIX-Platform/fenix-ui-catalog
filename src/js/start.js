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
        RESET_BUTTON: "[data-role='reset']",
        BOTTOM: "[data-role='bottom']",
        RESULTS_CONTAINER: "[data-role='results-container']",
        RESULTS: "[data-role='results']"
    };

    function Catalog(o) {
        log.info("FENIX catalog");
        log.info(o);

        $.extend(true, this, {initial: o}, CD, C);

        this._registerHandlebarsHelpers();

        this._parseInput();

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

    Catalog.prototype._parseInput = function () {

        this.id = this.initial.id;
        this.$el = this.initial.$el;
        this.defaultSelectors = this.initial.defaultSelectors || [];
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

            window.fx_catalog_menu_groups >= 0 ? window.fx_catalog_menu_groups++ : window.fx_catalog_menu_groups = 0;

            //Add menu id
            group.menuId = this.id;
            group.label = i18nLabels[group.id] || "Missing group title " + String(window.fx_catalog_menu_groups);

            //Add dynamic group id
            group.id = this.id + "-group-" + String(window.fx_catalog_menu_groups);
            group.opened = !!group.opened;

            //Iterate over group's items
            _.map(group.items, _.bind(function (item) {

                //Add dynamic item id
                window.fx_catalog_menu_items >= 0 ? window.fx_catalog_menu_items++ : window.fx_catalog_menu_items = 0;
                item.id = this.id + "-item-" + String(window.fx_catalog_menu_items);
                item.disabled = !!item.disabled;

                item.label = i18nLabels[item.selector] || "Missing item title: " + item.selector;

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

        this.current = {};

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

            self.selectSelector(selector)


        });

        this.$submit.on("click", _.bind(this._onSubmitClick, this));

        this.$reset.on("click", _.bind(this._onResetClick, this));

        this.filter.on('ready', _.bind(function () {

            this._unlock();

            this._selectDefaultSelectors();

        }, this));

        this.filter.on('remove', _.bind(function (item) {
            this._enableMenuItem(item.id);
        }, this));


        //amplify.subscribe(this._getEventName(EVT.SELECTORS_ITEM_SELECT), this, this._onSelectorItemSelect);
    };

    Catalog.prototype._selectDefaultSelectors = function () {
        var self = this;
        _.each(this.defaultSelectors, function (s) {
            self.selectSelector(s);
        });

    };

    Catalog.prototype.selectSelector = function (selector) {

        this._disableMenuItem(selector);

        this._addSelector(selector);

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

        if (!SelectorsRegistry.hasOwnProperty(selector)) {
            log.error("Impossible to find selector in registry: " + selector);
            return;
        }

        var config = {};
        config[selector] = $.extend(true, {}, SelectorsRegistry[selector]);

        if (!config[selector].template) {
            config[selector].template = {};
        }

        config[selector].template.title = i18nLabels[selector] || "Missing title";

        this.filter.add($.extend(true, {}, config));
    };

    Catalog.prototype._onSubmitClick = function () {

        if (this.filter && !$.isFunction(this.filter.getValues)) {
            log.error("Filter.getValues is not a fn()");
            return;
        }

        this.current.values = this.filter.getValues("catalog");

        this._search();
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
            summary$el: s.SUMMARY,
            //summaryRender : function (item ){ return " -> " + item.code; },
            common: {
                template: {
                    hideHeader: false,
                    hideRemoveButton: false
                },
                selector: {
                    hideFooter: true
                },
                className: "col-xs-6"
            }
        });
    };

    //Request

    Catalog.prototype._search = function () {

        var self = this,
            body = this.current.values;

        this._setBottomStatus("loading");

        this._lock();

        this._getPromise(body).then(
            _.bind(this._renderResults, this),
            function (e) {
                self._setBottomStatus("error");
                log.error(e);
                self._unlock();
            });

    };

    Catalog.prototype._setBottomStatus = function (status) {

        this.$el.find(s.BOTTOM).attr('data-status', status);
    };

    Catalog.prototype._getPromise = function (body) {

        return Q($.ajax({
            url: CD.SERVER + CD.FILTER_SERVICE + '?' + CD.FILTER_QUERY_PARAMS,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(body),
            dataType: 'json'
        }));
    };

    Catalog.prototype._renderResults = function (data) {

        this._setBottomStatus('ready');

        this._unlock();

        //render template
        var template = Handlebars.compile($(Templates).find(s.RESULTS)[0].outerHTML),
            model = $.extend(true, {}, i18nLabels, {results: data}),
            $html = $(template(model));

        this.$el.find(s.RESULTS_CONTAINER).html($html);
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