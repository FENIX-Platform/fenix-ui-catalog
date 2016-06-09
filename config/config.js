/*global define*/

define(function () {

    'use strict';

    return {

        perPage : 10,

        resultActions : ['select'], //'metadata', 'view', 'download'

        excludedAction : {
            dataset : [],
            geographic : ['download']
        },

        menuExcludedItems: [],

        tableColumns : {
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

        d3pFindParams : {
            full: true,
            order : "meMaintenance.seUpdate.updateDate:desc" //order by last update
        },

        cache : false

    }

});