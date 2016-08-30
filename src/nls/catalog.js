if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
        "./en/catalog",
        "./fr/catalog"
    ],
    function (i18nEn,i18nFr) {

        'use strict';

        return {

            en: i18nEn,
            fr: i18nFr

        }
    });