if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

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
                default : ['dataset'],
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
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
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
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
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
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
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
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
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
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
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
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
                type : "text"
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "enumeration",
                metadataAttribute: "uid"
            }

        },

        contextSystem : {

            selector : {
                id : "dropdown",
                source : [{value : "uneca", label : "UNECA"}],
                default : ["uneca"],
                hideSummary : true,
                config : {
                    plugins: ['remove_button'],
                    mode: 'multi'
                }
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "enumeration",
                metadataAttribute: "dsd.contextSystem"
            }
        }
    }

});