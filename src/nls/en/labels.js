if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {

    'use strict';

    return {
        //Text

        text_intro: "Loading resources...",
        text_empty: "Results are empty. <br> Please check your filter criteria.",
        text_huge: "Too many results. <br> Please add more filter criteria.",
        text_ohsnap: "Oh snap! <br> Something went wrong.",

        submit_button: "Submit",
        reset_button: "Reset",

        //menu and selector titles
        freeText: "Free text",
        resourceType: "Resource Type",
        referencePeriod: "Reference Period",
        referenceArea: "Reference Area",
        dataDomain: "Data Domain",
        statusOfConfidentiality: "Status of Confidentiality",
        uid: "Uid",
        title : "Title",
        region : "Region",
        source : "Source",
        last_update : "Last update",
        periodicity : "Periodicity",
        contextSystem : "Data Source",

        content : "Content",
        search_by_id : "Search by id",
        accessibility : "Accessibility",

        action_select : "Select",
        action_download : "Download",
        action_view : "View",
        action_metadata : "Metadata",

        //Errors
        request : "Request error",
        empty_values : "Empty selection",

        header_title : "Open a resource",

        tooltip_btn_close_catalog : "Close catalogue",
        tooltip_btn_add_selector : "Add metadata search field",

        //errors
        filter_validation: "Invalid searching criteria"
    }
});