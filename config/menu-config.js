/*global define*/
define(function () {

    'use strict';

    return [
        {
            url: "#",
            parent_id: "-1",
            id: "1",
            i18n: "content"
        },
        {
            url: "#",
            parent_id: "1",
            i18n: "resourceType",
            id: "11",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "resourceType"
            }
        },
        {
            url: "#",
            parent_id: "1",
            i18n: "referencePeriod",
            id: "12",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "referencePeriod"
            }
        },
        {
            url: "#",
            parent_id: "1",
            i18n: "referenceArea",
            id: "13",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "referenceArea"
            }
        },
        {
            url: "#",
            parent_id: "1",
            i18n: "dataDomain",
            id: "14",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "dataDomain"
            }
        },
        {
            url: "#",
            parent_id: "1",
            i18n: "region",
            id: "15",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "region"
            }
        },
        {
            url: "#",
            parent_id: "-1",
            i18n: "accessibility",
            id: "2"
        },
        {
            url: "#",
            parent_id: "2",
            i18n: "statusOfConfidentiality",
            id: "21",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "statusOfConfidentiality"
            }
        },
        {
            url: "#",
            parent_id: "-1",
            i18n: "search_by_id",
            id: "3"
        },
        {
            url: "#",
            parent_id: "3",
            i18n: "uid",
            id: "23",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "uid"
            }
        }
    ];
});
