if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {

    'use strict';

    var prefix = "fx.catalog.";

    return {

        select : prefix + 'select',
        view : prefix + 'view',
        download : prefix + 'download'

    };
});
