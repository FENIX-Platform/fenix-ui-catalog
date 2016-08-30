if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
        "./en/catalog"
    ],
    function (i18nEn) {

        'use strict';

        return {

            en: i18nEn

        }
    });