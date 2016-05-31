/*global define*/
define(function () {

    'use strict';

    return [
        {
            id: "content",
            opened : true,
            items: [
                { selector : "resourceType"},
                { selector : "contextSystem"},
                { selector : "referencePeriod"},
                { selector : "referenceArea"},
                { selector : "dataDomain"},
                { selector : "region"}
            ]
        },
        {
            id: "accessibility",
            items: [
                {selector : "statusOfConfidentiality"}
            ]
        },
        {
            id: "search_by_id",
            items: [
                { selector : "uid"}
            ]
        }
    ]

});