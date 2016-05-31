/*global define*/
define(function () {

    'use strict';

    var RECIPIENT = "Country / Region",
        DONOR = "Donor",
        DELIVERY = "Channel of delivery",
        SECTOR = "Sector",
        SUB_SECTOR = "Sub-Sector",
        ODA = "Official Development Assistance (ODA)",
        YEAR_FROM = "from",
        YEAR_TO = "to";

    return {
        "compare": "Compare",
        "recipient": RECIPIENT,
        "donor": DONOR,
        "delivery": DELIVERY,
        "sector": SECTOR,
        "sub-sector": SUB_SECTOR,
        "year_form": YEAR_FROM,
        "year_to": YEAR_TO,

        "collapse_btn": "Collapse / Expand this panel",
        "compare_btn": "Compare",
        "reset_btn": "Reset",
        "clear_all_btn": "Clear All",
        "select_all_btn": "Select All",
        "search_placeholder": "Filter",
        "download" : "Download",

        "sel_heading_recipient": RECIPIENT,
        "sel_heading_donor": DONOR,
        "sel_heading_oda": ODA,
        "sel_heading_year": "Year",
        "sel_heading_compare": "Compare by",
        "sel_heading_delivery": DELIVERY,
        "sel_heading_sector": SECTOR,
        "sel_heading_sub_sector": SUB_SECTOR,
        "sel_tab_country_country": "Countries",
        "sel_tab_country_region": "Regions",
        "sel_tab_regional_aggregation": "Regional Aggregation",

        "expectedResult": "Expected results",
        "compare_as": "Compare as",
        "tab_chart": "Chart",
        "tab_table": "Table",
        "tab_info": "Info",
        "result_error": "Aw snap! There was a problem loading this resource",
        "result_empty": "No data for the current selection",

        "show_advanced_options": "Show advanced options",

        //info tab
        "info_current_selection": "Current selection:",
        "info_title_oda": ODA,
        "info_title_recipient": RECIPIENT,
        "info_title_donor": DONOR,
        "info_title_delivery": DELIVERY,
        "info_title_sector": SECTOR,
        "info_title_sub-sector": SUB_SECTOR,
        "info_title_year_from": YEAR_FROM,
        "info_title_year_to": YEAR_TO,

        "reload": "Reload"

    }
});