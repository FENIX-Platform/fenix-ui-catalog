if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {

    'use strict';

    return {
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
        tooltip_btn_add_selector : "Add metadata search field"
    }
});