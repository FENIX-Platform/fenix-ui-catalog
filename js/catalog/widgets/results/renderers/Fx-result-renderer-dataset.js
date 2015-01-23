define([
    "jquery",
    "text!fx-cat-br/html/fx_result_fragments.html",
    'amplify'
], function ($, template) {

    //Default Result options
    var defaultOptions = {
        error_prefix: "FENIX Result dataset creation error: "
    }, selectors = {
        s_result: ".fenix-result",
        s_desc_title: ".fx_result_description_title",
        s_desc_source: ".fx_result_description_source",
        s_desc_geo: ".fx_result_description_geograficalarea",
        s_desc_period: ".fx_result_description_baseperiod",
        s_uid: ".fx_result_uid",
        s_version: '.fx_result_version'
    }, $result;

    function Fx_catalog_result_render_dataset(options) {
        this.o = {};
        $.extend(this.o, options);
    }

    Fx_catalog_result_render_dataset.prototype.initText = function () {

        if (this.o.hasOwnProperty('uid') && this.o.uid !== null) {

            $result.find(selectors.s_uid).html(this.o.uid);
        }

        if (this.o.hasOwnProperty('version') && this.o.version !== null) {

            $result.find(selectors.s_version).html(this.o.version);
        }

        if (this.o.hasOwnProperty('title') && this.o.title !== null) {

            if (this.o.title.hasOwnProperty('EN')) {
                $result.find(selectors.s_desc_title).html(this.o.title['EN']);
            } else {

                var keys = Object.keys(this.o.title);

                if (keys.length > 0) {
                    $result.find(selectors.s_desc_title).html(this.o.title[keys[0]]);
                }
            }
        }
    };

    Fx_catalog_result_render_dataset.prototype.initModal = function () {

        $result.find("#myModalLabel").html(this.o.name);
    };

    Fx_catalog_result_render_dataset.prototype.addActions = function () {

        var self = this,
            actions,
            key;

        if (this.o.hasOwnProperty('actions')) {

            actions = this.o.actions;

            for (key in actions) {

                var $b = $('<button class="btn btn-default">' + actions[key].labels.EN + '</button>');
                $b.on('click', function (e) {
                    //Listen to it within Fx-catalog-results-generator
                    $(e.currentTarget).trigger(actions[key].event, [self.o]);
                    amplify.publish('fx.widget.catalog.'+actions[key].event, self.o);
                });

                $result.find('.results-actions-container').prepend($b)
            }
        }
    };

    Fx_catalog_result_render_dataset.prototype.getHtml = function () {

        $.extend(this.o, defaultOptions);

        $result = $(template).find(selectors.s_result).clone();

        if ($result.length === 0) {
            throw new Error(o.error_prefix + " HTML fragment not found");
        }

        $result.addClass("dataset");

        this.initText();
        this.initModal();
        this.addActions();

        return $result.get(0);
    };

    return Fx_catalog_result_render_dataset;
});
