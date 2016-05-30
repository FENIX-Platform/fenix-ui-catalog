/*global define*/
define(function () {

    'use strict';

    return {

        resourceType: {


            enumeration : {
                uid: "RepresentationType"
            },

            selector : {
                id : "dropdown",
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


            cl : {
                uid: "FAO_Period",
                version: "1.0"
            },

            selector : {
                id : "dropdown",
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


            cl : {
                uid: "GAUL_ReferenceArea",
                version: "1.0"
            },

            selector : {
                id : "dropdown",
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


            cl : {
                uid: "UNECA_ClassificationOfActivities",
                level : 2,
                levels : 1
            },

            selector : {
                id : "dropdown",
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

            cl : {
                uid: "GAUL0",
                version: "2014"
            },

            selector : {
                id : "dropdown",
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

            cl : {
                uid: "CL_CONF_STATUS",
                version: "1.0"
            },

            selector : {
                id : "dropdown",
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

            selector : {
                id : "input",
                type : "text",
                default : ['UNECA_Education']
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