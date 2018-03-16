define(function () {

    'use strict';

    return {

        lang : "EN",

        pagination: true,

        langFallbackOrder : ["EN", "FR", "ES", "AR", "PR"],
        
        perPage : 10,

        actions : ['select'], //'metadata', 'view', 'download'

        excludedAction : {
            dataset : [],
            geographic : ['download']
        },

        menuExcludedItems: [],

        defaultSelectors : ['freeText', 'resourceType', 'contextSystem'],

        environment : "develop",

        columns : {
            title: {
                path : "title",
                type: "i18n"
            },
            source : {
                path : "contacts",
                type : "source"
            },
            last_update : {
                path : "meMaintenance.seUpdate.updateDate",
                type : "epoch"
            },
            region : {
                path: "meContent.seCoverage.coverageGeographic",
                type: "code"
            },
            resourceType : {
                path: "meContent.resourceRepresentationType"
            }
        },

        searchTimeoutInterval : 1000,

        dateFormat: 'YYYY MMM DD',

        findServiceParams : {
            full: true,
            order : "meMaintenance.seUpdate.updateDate:desc" //order by last update
        },

        cache : false,

        httpStatusMaxSizeError : 416,

        httpStatusNoContent: 204,

        hideCloseButton : false,

        baseFilter : {},

        hideAddButton: false
    }

});