/*global define*/
define(function () {

    'use strict';

    return [
        {
            url: "",
            parent_id: "root",
            id: "content"
        },
        {
            url: "",
            parent_id: "content",
            id: "resourceType",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "resourceType"
            }
        },
        {
            url: "",
            parent_id: "content",
            id: "contextSystem",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "contextSystem"
            }
        },
        {
            url: "",
            parent_id: "content",
            id: "referencePeriod",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "referencePeriod"
            }
        },
        {
            url: "",
            parent_id: "content",
            id: "referenceArea",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "referenceArea"
            }
        },
        {
            url: "",
            parent_id: "content",
            id: "dataDomain",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "dataDomain"
            }
        },
        {
            url: "",
            parent_id: "content",
            id: "region",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "region"
            }
        },
        {
            url: "",
            parent_id: "root",
            id: "accessibility",
        },
        {
            url: "",
            parent_id: "accessibility",
            id: "statusOfConfidentiality",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "statusOfConfidentiality"
            }
        },
        {
            url: "",
            parent_id: "root",
            id: "search_by_id",
        },
        {
            url: "",
            parent_id: "search_by_id",
            id: "uid",
            a_attrs: {
                "data-action": "selector",
                "data-selector": "uid"
            }
        }
    ];
});
