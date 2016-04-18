/*global define*/
define(function () {

    'use strict';

    return [
        {
            label: "Category",
            
            items: [
                {label: "Label 1", selector : "range"},
                {label: "Label 2", selector : "time"}
            ]
        },
        {
            label: "Category 2",
            opened : true,
            items: [
                {label: "Label 12", selector : "compare"},
                {label: "Label 22", selector : "recipient"}
            ]
        },
        {
            label: "Category 3",
            items: [
                {label: "Label 123", selector : "donor"},
                {label: "Label 223", selector : "delivery"}
            ]
        }
    ]

});