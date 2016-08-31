if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {

    'use strict';

    return {
        submit_button: "[FR] Submit",
        reset_button: "[FR] Reset",

        //menu and selector titles
        resourceType: "[FR] Resource Type",
        referencePeriod: "[FR] Reference Period",
        referenceArea: "[FR] Reference Area",
        dataDomain: "[FR] Data Domain",
        statusOfConfidentiality: "[FR] Status of Confidentiality",
        uid: "[FR] Uid",
        title : "[FR] Title",
        region : "[FR] Region",
        source : "[FR] Source",
        last_update : "[FR] Last update",
        periodicity : "[FR] Periodicity",
        contextSystem : "[FR] Data Source",

        content : "[FR] Content",
        search_by_id : "[FR] Search by id",
        accessibility : "[FR] Accessibility",

        action_select : "[FR] Select",
        action_download : "[FR] Download",
        action_view : "[FR] View",
        action_metadata : "[FR] Metadata",

        //Errors
        request : "[FR] Request error",
        empty_values : "[FR] Empty selection",

        header_title : "[FR] Open a resource",

        tooltip_btn_close_catalog : "[FR] Close catalogue",
        tooltip_btn_add_selector : "[FR] Add metadata search field"
    }
});