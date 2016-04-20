/*global define*/
define(function () {

    'use strict';

    return {

        resourceType: {

            className : "col-xs-12",

            enumeration : {
                uid: "RepresentationType"
            },

            selector : {
                id : "tree",
                hideSummary : true,
                default : ['dataset']
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "enumeration",
                metadataAttribute: "meContent.resourceRepresentationType"
            }

        },

        referencePeriod: {

            className : "col-xs-12",

            cl : {
                uid: "FAO_Period",
                version: "1.0"
            },

            selector : {
                id : "tree",
                hideSummary : true
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "codes",
                metadataAttribute: "meContent.seReferencePopulation.referencePeriod"
            }
        },

        referenceArea: {

            className : "col-xs-12",

            cl : {
                uid: "GAUL_ReferenceArea",
                version: "1.0"
            },

            selector : {
                id : "tree",
                hideSummary : true
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "codes",
                metadataAttribute: "meContent.seReferencePopulation.referenceArea"
            }
        },
        
        dataDomain: {

            className : "col-xs-12",

            cl : {
                uid: "UNECA_ClassificationOfActivities",
                level : 2,
                levels : 1
            },

            selector : {
                id : "tree",
                hideSummary : true
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "codes",
                metadataAttribute: "meContent.seCoverage.coverageSectors"
            }

        },

        region: {

            className : "col-xs-12",

            cl : {
                uid: "GAUL0",
                version: "2014"
            },

            selector : {
                id : "tree",
                hideSummary : true
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "codes",
                metadataAttribute: "meContent.seCoverage.coverageGeographic"
            }
        },

        statusOfConfidentiality: {

            className : "col-xs-12",

            cl : {
                uid: "CL_CONF_STATUS",
                version: "1.0"
            },

            selector : {
                id : "tree",
                hideSummary : true
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "codes",
                metadataAttribute: "meAccessibility.seConfidentiality.confidentialityStatus"
            }

        },

        uid: {

            className : "col-xs-12",

            selector : {
                id : "input",
                type : "text"
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "enumeration",
                metadataAttribute: "uid"
            }

        }

    }

});