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
        };

    var w_Commons;

    function Fx_Catalog_Resume_Bar() {
        w_Commons = new W_Commons();
    }

    Fx_Catalog_Resume_Bar.prototype.initEventListeners = function () {

        var that = this;

        document.body.addEventListener(o.events.READY, function (e) {
            that.addItem(e.detail)
        }, false);

        document.body.addEventListener(o.events.REMOVE, function (e) {
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
            this.addItem(item)
        }
    };

    Fx_Catalog_Resume_Bar.prototype.printTags = function ($container, values, item) {

        $container.empty();

        for (var i = 0; i < values.length; i++){
            $container.append(this.getTag(values[i], item));
        }
    };

    Fx_Catalog_Resume_Bar.prototype.getTag = function( obj, item ){
        var $obj = $('<div class="fx-catalog-resume-list-obj"></div>'),
            $close = $('<div class="fx-catalog-resume-obj-close">x</div>'),
            $value = $('<div class="fx-catalog-resume-obj-value">'+obj.label+'</div>');

        $close.on('click', function () {

            $obj.remove();

            w_Commons.raiseCustomEvent(
                document.body,
                o.events.DESELECT + item.module,
                {value : obj.value}
            );
        });

        return $obj.append($close).append($value);
    };

    Fx_Catalog_Resume_Bar.prototype.findResumeItem = function (module) {
        return  $(o.container).find('[data-module="' + module + '" ]');
    };

    Fx_Catalog_Resume_Bar.prototype.createResumeItem = function ( item ) {

        return  $('<div class="fx-resume-item-selected" data-module="' + item.module + '"><div data-role="title" class="fx-resume-module-title">'+ item.module +'</div><div data-role="list" class="fx-resume-module-list"></div></div>');
    };

    return Fx_Catalog_Resume_Bar;

});