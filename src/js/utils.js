/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'fx-catalog/config/errors',
    'fx-catalog/config/events',
    'fx-catalog/config/config',
    'fx-catalog/config/config-default',
    'amplify'
], function ($, _, log, ERR, EVT, C, CD) {

    'use strict';

    var opts = {
        lang: 'EN'
    };

    function Utils() {

        $.extend(true, this, opts, CD, C);

        return this;
    }

    return new Utils();
});