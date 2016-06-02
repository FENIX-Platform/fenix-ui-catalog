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
    "fx-common/json-menu",
    "fx-common/bridge",
    "fx-common/utils",
    'handlebars',
    "moment",
    'bootstrap-table',
    'amplify',
    'bootstrap'
], function ($, _, log, ERR, EVT, C, CD, MenuConfig, SelectorsRegistry, Templates, i18nLabels, Filter, JsonMenu, Bridge, Utils, Handlebars, Moment) {

    'use strict';

    var s = {
        CATALOG: "[data-role='catalog']",
        MENU: "[data-role='menu']",
        MENU_GROUPS: "[data-role='menu-group']",
        MENU_ITEMS: "[data-role='menu-item']",
        FILTER: "[data-role='filter']",
        SUMMARY: "[data-role='summary']",
        BOTTOM: "[data-role='bottom']",
        RESULTS_CONTAINER: "[data-role='results-container']",
        RESULTS: "[data-role='results']",
        RESULT: "[data-role='result']",
        PAGINATION: "[data-role='pagination']",
        ERROR_CONTAINER: "[data-role='error-container']",
        ACTIONS: "[data-role='actions']"
    };

    function Catalog(o) {
        log.info("FENIX catalog");
        log.info(o);

        $.extend(true, this, {initial: o}, CD, C);

        this._registerHandlebarsHelpers();

        this._parseInput();

        var valid = this._validateInput();

        log.info("Catalog has valid input? " + JSON.stringify(valid));

        if (valid === true) {

            this._attach();

            this._hideError();

            this._setBottomStatus('intro');

            this._initVariables();

            this._initComponents();

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

        this._resetResults();

        this._hideError();

        if (this.filter && !$.isFunction(this.filter.clear)) {
            log.error("Filter.clear is not a fn()");

            return;
        }

        this.filter.clear();

        log.info("Catalog reset");
    };

    /**
     * pub/sub
     * @return {Object} catalog instance
     */
    Catalog.prototype.on = function (channel, fn) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: this, callback: fn});
        return this;
    };

    /**
     * Dispose
     * @return {null}
     */
    Catalog.prototype.dispose = function () {

        //unbind event listeners
        this._unbindEventListeners();

        this.$el.find(s.RESULTS).bootstrapTable('destroy');

        log.info("Catalog disposed successfully");

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

        this.$el = this.initial.$el;
        this.defaultSelectors = this.initial.defaultSelectors || C.defaultSelectors || CD.defaultSelectors;
        this.actions = this.initial.actions || C.result_actions || CD.result_actions;
        this.selectorsRegistry = $.extend(true, {}, SelectorsRegistry, this.initial.selectorsRegistry);
        this.baseFilter = this.initial.baseFilter || {};
        this.tableColumns = this.initial.tableColumns || C.table_columns || CD.table_columns;
        this.environment = this.initial.environment;
        this.lang = this.initial.lang || "EN";
        this.lang = this.lang.toUpperCase();

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
            $html = $(template($.extend(true, {}, i18nLabels)));

        this.$el.html($html);

        //render menu

        this.menu = new JsonMenu({
            el: this.$el.find(s.MENU),
            model: MenuConfig.map(function (item) {

                item.label = i18nLabels[item.i18n] || "Missing label [" + item.id + "]";

                return item;
            })
        });

        log.info("template attached successfully");

    };

    Catalog.prototype._initVariables = function () {

        //pub/sub
        this.channels = {};

        //menu
        this.$menu = this.$el.find(s.MENU);
        this.$items = this.$menu.find(s.MENU_ITEMS);

        this.current = {};
        this.current.perPage = C.per_page || CD.per_page;
        this.current.page = 0;

        this.actions = this.actions.map(_.bind(function (value) {

            return {
                label: i18nLabels['action_' + value] || "Missing action label [" + value + "]",
                action: value
            }

        }, this));

        this.bridge = new Bridge({
            environment: this.environment
        });

        this.searchThrottleTimeout = C.searchThrottleTimeout || CD.searchThrottleTimeout;

        Moment.locale(this.lang);

        this.dateFormat = C.dateFormat || CD.dateFormat;

    };

    Catalog.prototype._enableMenuItem = function (selector) {

        this.menu.enableItem(selector);
    };

    Catalog.prototype._disableMenuItem = function (selector) {

        this.menu.disableItem(selector);

    };

    Catalog.prototype._bindEventListeners = function () {

        var self = this;

        this.$el.find("[data-action='selector']").on("click", function (e) {
            e.preventDefault();

            var selector = $(e.target).data("selector");

            log.info("Select selector: " + selector);

            self.selectSelector(selector);

            self._hideError();

        });

        this.filter.on('ready', _.bind(function () {

            log.info("Filter is ready");

            this._unlock();

            this._refreshResults();

        }, this));

        this.filter.on('remove', _.bind(function (item) {

            log.info("Remove from filter: " + item.id);

            this._enableMenuItem(item.id);

            this._refreshResults();

        }, this));

        this.filter.on('change', _.bind(_.throttle(this.onFilterChangeEvent, this.searchThrottleTimeout), this));

        amplify.subscribe(this._getEventName("select"), this, this._onSelectResult);
        amplify.subscribe(this._getEventName("download"), this, this._onDownloadResult);
        amplify.subscribe(this._getEventName("view"), this, this._onViewResult);
        amplify.subscribe(this._getEventName("metadata"), this, this._onMetadataResult);
    };

    Catalog.prototype.onFilterChangeEvent = function () {

        log.info("Change from filter");

        this._refreshResults();

        //this._hideError();

    };

    Catalog.prototype.selectSelector = function (selector) {

        this._disableMenuItem(selector);

        this._addSelector(selector);

    };

    Catalog.prototype._unlock = function () {
    };

    Catalog.prototype._lock = function () {
    };

    Catalog.prototype._addSelector = function (selector) {

        var config = this._getSelectorConfiguration(selector);

        this.filter.add(config);
    };

    Catalog.prototype._getSelectorConfiguration = function (selector) {

        if (!this.selectorsRegistry.hasOwnProperty(selector)) {
            log.error("Impossible to find selector in registry: " + selector);
            return;
        }

        var config = {};
        config[selector] = $.extend(true, {}, this.selectorsRegistry[selector]);

        if (!config[selector].template) {
            config[selector].template = {};
        }

        config[selector].template.title = i18nLabels[selector] || "Missing title [" + selector + "]";

        return $.extend(true, {}, config);

    };

    Catalog.prototype._refreshResults = function () {

        if (this.filter && !$.isFunction(this.filter.getValues)) {
            log.error("Filter.getValues is not a fn()");
            return;
        }

        this.current.values = this.filter.getValues();

        this.current.filter = this.filter.getValues("catalog");

        var valid = this._validateQuery();

        if (valid === true) {
            this._search();
            this._hideError();
        } else {

            if (Array.isArray(valid) && valid[0] === ERR.empty_values) {
                this._setBottomStatus("intro")
            }
            else {
                this._showError(valid);
            }
        }
    };

    Catalog.prototype._validateQuery = function () {

        var valid = true,
            errors = [];

        if ($.isEmptyObject(this.current.filter)) {
            errors.push(ERR.empty_values);
            log.error(ERR.empty_values);
            return errors;
        }

        return errors.length > 0 ? errors : valid;
    };

    Catalog.prototype._initComponents = function () {

        log.info("Filter instantiation");

        this.filter = new Filter({
            el: s.FILTER,
            items: this._getDefaultSelectors(),
            //summary$el: s.SUMMARY,
            direction: "prepend",
            ensureAtLeast: 1,
            environment: this.environment,
            //summaryRender : function (item ){ return " -> " + item.code; },
            common: {
                template: {
                    hideHeader: false,
                    hideRemoveButton: false
                },
                selector: {
                    hideFooter: true
                }
            }
        });

        _.each(this.defaultSelectors, _.bind(function (selector) {
            this._disableMenuItem(selector);
        }, this));

        this.$el.find(s.RESULTS).bootstrapTable({
            pagination: true,
            pageSize: this.current.perPage,
            pageList: [],
            columns: this._createTableColumnsConfiguration(),
            onPageChange : _.bind(function(){
                this._unbindResultsEventListeners();
                this._bindResultsEventListeners()
            }, this),
            onSort: _.bind(function(){

                window.setTimeout(_.bind(function(){
                    this._unbindResultsEventListeners();
                    this._bindResultsEventListeners()
                }, this),100)

            }, this)
        });

    };

    Catalog.prototype._createTableColumnsConfiguration = function () {

        var tableColumns = Object.keys(this.tableColumns),
            columns = [],
            self = this;

        _.each(tableColumns, function (c) {

            columns.push({
                field: c,
                title: i18nLabels[c] || "Missing label [" + c + "]",
                sortable: true
            });

        });

        // add rid
        columns.push({
            field: "rid",
            visible: false
        });

        var resourceTypeColumn = _.findWhere(columns, {field : "resourceType"}) || {};
        resourceTypeColumn.visible = false;

        //Add actions column
        columns.push({
            formatter: function (value, row) {

                var template = Handlebars.compile($(Templates).find(s.ACTIONS)[0].outerHTML),
                    model = $.extend(true, {}, i18nLabels, row, {actions: self._getActions(row)}),
                    $html = $(template(model));

                return $html[0].outerHTML
            }
        });

        return columns;
    };

    Catalog.prototype._getActions = function ( row ) {

        var excluded = C.excluded_action || CD.excluded_action || {},
            to_exclude = excluded[row.resourceType] || [],
            actions = this.actions;

        _.each(to_exclude, function ( excl ) {
            actions = _.reject(actions, {action : excl})
        });

        return actions;

    };

    Catalog.prototype._getDefaultSelectors = function () {

        var self = this,
            items = {};

        _.each(this.defaultSelectors, function (selector) {
            items = $.extend(true, {}, items, self._getSelectorConfiguration(selector));
        });

        log.info("Default items: " + JSON.stringify(items));

        return items;

    };

    Catalog.prototype._resetResults = function () {

        this._setBottomStatus('intro');

        this._unbindResultsEventListeners();

    };

    //Request

    Catalog.prototype._search = function () {

        var body = this.current.filter;

        this._setBottomStatus("loading");

        this._lock();

        window.fx_req_id >= 0 ? window.fx_req_id++ : window.fx_req_id = 0;

        this.reqeust_id = "fx-request-id-" + window.fx_req_id;

        this.bridge.find({
            body: $.extend(true, {}, this.baseFilter, body),
            params: {
                full: true
            }
        }).then(
            _.bind(this._renderResults, this, "fx-request-id-" + window.fx_req_id),
            _.bind(function (requestId, e) {

                if (this.reqeust_id !== requestId) {
                    log.warn("Abort result rendering because it is not the last request");
                    return;
                }

                this._setBottomStatus("error");
                this.error(e);
                this._unlock();
                this._showError(ERR.request);

            }, this, "fx-request-id-" + window.fx_req_id));

    };

    Catalog.prototype._setBottomStatus = function (status) {

        log.info("Set status to: " + status);

        this.$el.find(s.BOTTOM).attr('data-status', status);

    };

    Catalog.prototype._renderResults = function (requestId, data) {

        if (this.reqeust_id !== requestId) {
            log.warn("Abort result rendering because it is not the last request");
            return;
        }

        this.current.data = data;
        this.current.model = this._parseData(this.current.data);

        if (!this.current.data) {
            this._setBottomStatus("empty");
            return;
        }

        this._setBottomStatus('ready');

        this._unlock();

        this._renderTable();

    };

    Catalog.prototype._parseData = function (d) {

        var data = [];

        _.each(d, _.bind(function (record) {

            data.push(this._parseRecord(record));

        }, this));

        return data;
    };

    Catalog.prototype._parseRecord = function (record) {

        var result = {};

        _.each(this.tableColumns, _.bind(function (col, id) {
            result[id] = this._getColumnValue(record, $.extend(true, {id: id}, col));
        }, this));

        //add rid to model
        result["rid"] = this._getColumnValue(record, $.extend(true, {id: "rid"}, {}));

        return result;
    };

    Catalog.prototype._getColumnValue = function (record, col) {

        var label = " ",
            path = col.path ? col.path : col.id,
            metadataValue = Utils.getNestedProperty(path, record) || {},
            type = col.type || "",
            i18nLabel;


        switch (type.toLowerCase()) {
            case "i18n":
                i18nLabel = this._getI18nLabel(metadataValue);
                label = i18nLabel ? i18nLabel : " ";
                break;
            case "source":

                var owner = _.findWhere(metadataValue, {role: "owner"}) || {},
                    organization = owner.organization,
                    pointOfContact = owner.pointOfContact,
                    organizationI18nLabel = this._getI18nLabel(organization),
                    bothPopulated = organizationI18nLabel && pointOfContact;

                label += organizationI18nLabel ? organizationI18nLabel : "";

                label += bothPopulated ? " - " : "";

                label += pointOfContact ? + pointOfContact : "";

                break;
            case "epoch":

                label = new Moment(metadataValue).format(this.dateFormat);
                break;
            case "code":

                var code = (Array.isArray(metadataValue.codes) && metadataValue.codes.length > 0) ? metadataValue.codes[0] : {};

                i18nLabel = this._getI18nLabel(code.label);
                label = i18nLabel ? i18nLabel : " ";

                break;
            default :

                label = metadataValue;

        }

        return label ? label : null;
    };

    Catalog.prototype._renderTable = function () {

        this._unbindResultsEventListeners();

        this.$el.find(s.RESULTS).bootstrapTable('load', this.current.model);

        this._bindResultsEventListeners();

    };

    Catalog.prototype._unbindResultsEventListeners = function () {
        this.$el.find(s.RESULTS).find("[data-action]").off();
    };

    Catalog.prototype._bindResultsEventListeners = function () {

        var self = this;

        this.$el.find(s.RESULTS).find("[data-action]").each(function () {

            var $this = $(this),
                action = $this.data("action"),
                event = self._getEventName(action),
                rid = $this.data("rid");

            $this.on("click", {
                event: event,
                rid: rid,
                values: self.current.values,
                filter: self.current.filter
            }, function (e) {
                e.preventDefault();

                log.info("Result raise event: " + e.data.event);

                var model = _.findWhere(self.current.data, {rid: rid});

                amplify.publish(event, {rid: rid, model: model, filter: e.data.filter, values: e.data.values});

            });
        });
    };

    // Handlers

    Catalog.prototype._onSelectResult = function (payload) {

        log.info("Select result: " + JSON.stringify(payload));

        this._trigger('select', payload);

    };

    Catalog.prototype._onDownloadResult = function (payload) {

        log.info("Download result: " + JSON.stringify(payload));

        this._trigger('download', payload);

    };

    Catalog.prototype._onViewResult = function (payload) {

        log.info("View result: " + JSON.stringify(payload));

        this._trigger('view', payload);
    };

    Catalog.prototype._onMetadataResult = function (payload) {

        log.info("Metadata result: " + JSON.stringify(payload));

        this._trigger('metadata', payload);
    };

    Catalog.prototype._getEventName = function (evt, excludeId) {

        var baseEvent = EVT[evt] ? EVT[evt] : evt;

        return excludeId === true ? baseEvent : baseEvent + "." + this.id;
    };

    //disposition

    Catalog.prototype._unbindEventListeners = function () {

        this.$el.find('[data-action]').off();

        amplify.unsubscribe(this._getEventName("select"), this._onSelectResult);
        amplify.unsubscribe(this._getEventName("download"), this._onDownloadResult);
        amplify.unsubscribe(this._getEventName("view"), this._onViewResult);
        amplify.unsubscribe(this._getEventName("metadata"), this._onMetadataResult);

    };

    Catalog.prototype._registerHandlebarsHelpers = function () {

        Handlebars.registerHelper('isOpened', function (opened) {
            return opened === true ? 'in' : '';
        });

    };

    Catalog.prototype._showError = function (err) {

        if (!Array.isArray(err)) {
            err = [err];
        }

        _.each(err, _.bind(function (e) {

            var $li = $("<li>" + i18nLabels[e] + "</li>");
            this.$el.find(s.ERROR_CONTAINER).show().html($li);

        }, this));

    };

    Catalog.prototype._hideError = function () {

        this.$el.find(s.ERROR_CONTAINER).hide();
    };

    Catalog.prototype._getI18nLabel = function (obj) {

        return typeof obj === "object" ? obj[this.lang] : null;

    };

    return Catalog;
});