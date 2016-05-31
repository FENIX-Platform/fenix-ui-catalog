/*global define*/

define(function () {

    'use strict';

    return {

        per_page : 10,

        result_actions : ['select'], //'metadata', 'view', 'download'

        table_columns : {
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
           /* periodicity : {
                path: "meContent.seReferencePopulation.referencePeriod",
                type: "code"
            }*/
        },

        searchThrottleTimeout : 5000,

        dateFormat: 'YYYY MMM DD'
        
    }

});