define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons",
    'bootstrap'
], function ($, W_Commons) {

    var o = { },
        defaultOptions = {
            widget: {
                lang: 'EN'
            },
            events: {
                READY: 'fx.catalog.module.ready',
                REMOVE: 'fx.catalog.module.remove',
                DESELECT: 'fx.catalog.module.deselect.'
            }
        },
        s = {
            COURTESY_MSG : '.fx-catalog-resume-noitem'
        };

    var w_Commons;

    function Fx_Catalog_Resume_Bar() {
        w_Commons = new W_Commons();
        this.counter = 0;
    }

    Fx_Catalog_Resume_Bar.prototype.initEventListeners = function () {

        var that = this;

        o.catalog.addEventListener(o.events.READY, function (e) {
            that.addItem(e.detail)
        }, false);

        o.catalog.addEventListener(o.events.REMOVE, function (e) {
            that.removeItem(e.detail.type)
        }, false);

    };

    Fx_Catalog_Resume_Bar.prototype.init = function (options) {

        //Merge options
        $.extend(o, defaultOptions);
        $.extend(o, options);
    };

    Fx_Catalog_Resume_Bar.prototype.render = function () {

        this.initEventListeners();
    };

    Fx_Catalog_Resume_Bar.prototype.removeItem = function (item) {
        this.findResumeItem(item).remove();
    };

    Fx_Catalog_Resume_Bar.prototype.addItem = function (item) {
        var module = this.findResumeItem(item.module);

        if (module.length !== 0) {
            var $list = module.find('[data-role="list"]');
            this.printTags($list, item.value, item);
        } else {
            $(o.container).append(this.createResumeItem(item));
            this.addItem(item);
        }
    };

    Fx_Catalog_Resume_Bar.prototype.printTags = function ($container, values, item) {

        $container.empty();

        for (var i = 0; i < values.length; i++){
            $container.append(this.getTag(values[i], item));
        }
    };

    Fx_Catalog_Resume_Bar.prototype.getTag = function( obj, item ){


        var $obj = $('<div class="fx-resume-list-obj"></div>'),
            $close = $('<div class="fx-resume-obj-close"></div>'),
            $value = $('<div class="fx-resume-obj-value">'+obj.label+'</div>');

        $close.on('click', function () {

            $obj.remove();

            w_Commons.raiseCustomEvent(
                document.body,
                o.events.DESELECT + tem.module,
                {value : obj.value}
            );
        });

        return $obj.append($close).append($value);
    };

    Fx_Catalog_Resume_Bar.prototype.findResumeItem = function (module) {
        return  $(o.container).find('[data-module="' + module + '" ]');
    };

    Fx_Catalog_Resume_Bar.prototype.createResumeItem = function ( item ) {

        var icon;

        switch (item.module){
            case "resourceType" : icon="fa fa-database fa-fw"; break;
            case "uid" : icon="fa fa-slack fa-fw"; break;
            case "unitOfMeasure" : icon="fa fa-arrows-h fa-fw"; break;
            case "indicator" : icon="fa fa-archive fa-fw"; break;
            case "item" : icon="fa fa-dot-circle-o fa-fw"; break;
            case "coverageSector" : icon="fa fa-book fa-fw"; break;
            case "referencePeriod" : icon="fa fa-clock-o fa-fw"; break;
            case "basePeriod" : icon="fa fa-clock-o fa-fw"; break;
            case "updatePeriodicity" : icon="fa fa-calendar fa-fw"; break;
            case "region" : icon="fa fa-globe fa-fw"; break;
            case "source" : icon="fa fa-user fa-fw"; break;
            case "owner" : icon="fa fa-user fa-fw"; break;
            case "provider" : icon="fa fa-user fa-fw"; break;
        }

        var $c = $('<div class="fx-resume-item-selected" data-module="' + item.module + '"></div>'),
            $title = $('<div data-role="title" class="fx-resume-module-title"><em><i class=" ' + icon + '"></i>'+ item.module +'</em></div>'),
            $list = $('<div class="fx-resume-module-list-holder"><div data-role="list" class="fx-resume-module-list"></div></div>');

        $c.append($title).append($list);

        return $c;
    };

    Fx_Catalog_Resume_Bar.prototype.hideCourtesyMessage = function () {
        $(s.COURTESY_MSG).fadeOut(200);
    };

    Fx_Catalog_Resume_Bar.prototype.showCourtesyMessage = function () {
        $(s.COURTESY_MSG).fadeIn(200);
    };

    return Fx_Catalog_Resume_Bar;

});