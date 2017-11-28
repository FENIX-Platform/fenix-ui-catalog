define([
    'loglevel',
    'jquery',
    'underscore',
    '../html/template.hbs',
    '../../../src/js/index'
], function (log, $, _, Template, Catalog) {

    'use strict';

    var s = {
            STANDARD: "#standard"
        },
        catalogs = [],
        lang = "EN",
        environment = "production";

    function Dev() {

        this._importThirdPartyCss();

        console.clear();

        log.setLevel('silent');

        this.start();
    }

    Dev.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Dev.prototype._render = function () {

        //this._renderStandard();

        //this._renderGift();

        this._renderTraining();
    };

    Dev.prototype._renderStandard = function () {

        var catalog = this.createCatalog( {
            el: s.STANDARD,

            lang: lang,

            cache: false,

            pluginRegistry: {

                freeText: {

                    selector : {
                        id : "input",
                        type : "text"
                    },

                    template : {
                        hideRemoveButton : true,
                        hideSwitch : true
                    },

                    format : {
                        output : "freeText",
                        metadataAttribute: "freetext"
                    },

                    constraints : {
                        presence: true
                    }

                },

                dataDomain: {
                    selector: {
                        id : "dropdown",
                        config : {
                            plugins: ['remove_button'], //in combination with mode:'multi' create a 'X' button to remove items
                            mode: 'multi'
                        }
                    },

                    cl : {
                        uid:  "CSTAT_Core"
                    },

                    format : {
                        output : "codes",
                        metadataAttribute: "meContent.seCoverage.daniele"
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
                        hideRemoveButton : true,
                        hideSwitch : true
                    },

                    format : {
                        output : "codes",
                        metadataAttribute: "meContent.seCoverage.coverageGeographic"
                    }
                },

                coverageTime: {
                    selector: {
                        id: "range",
                        config: {
                            min: 1980,
                            max: new Date().getFullYear(),
                            type: "double",
                            grid: true,
                            force_edges: true,
                            prettify: function (num) {
                                return num;
                            }
                        }
                    },
                    template: {
                        title: "Coverage Time",
                        hideSwitch: true,
                        hideRemoveButton: true
                    },
                    format: {
                        metadataAttribute: "meContent.seCoverage.coverageTime",
                        output: "time"
                    }

                }
            },

            hideAddButton : true,

            columns : {
                title: {
                    path : "title",
                    type: "i18n",
                    title : "Title",
                    width: "80%"
                }
            },

            baseFilter: {
                "dsd.contextSystem": {"enumeration": ["gift"]},
                "meContent.resourceRepresentationType": {"enumeration": ["dataset"]},
                "meAccessibility.seConfidentiality.confidentialityStatus" : {codes: [{uid : "GIFT_ConfidentialityStatus", codes: ["5"]}]}
            },

            defaultSelectors: ["freeText", "region", "dataDomain", "coverageTime"]
        });

        catalog.on("select", function () {
            console.log("EVENT")
        })
    };

    Dev.prototype._renderGift = function () {

        var model = {
            "defaultSelectors": ["country", "time", "referenceArea", "coverageSector", "foodex2_code", "gender", "special_condition", "ageGranularity", "age"],
            "columns": {
                "title": {"path": "title", "type": "i18n", "title": "Title", "width": "50%"},
                "sampleSize": {"path": "sampleSize", "title": "Sample Size", "width": "20%"}
            },
            "searchService": {"serviceProvider": "//fenixservices.fao.org/gift/statistics/", "findService": "filter"},
            "actions": ["download", "metadata"],

            "pluginRegistry": {
                "gender": {
                    "cl": {"uid": "GIFT_Gender_filter"},
                    "selector": {
                        "id": "input",
                        "type": "radio",
                        "source": [{"label": "All", "value": "none"}],
                        "default": ["none"]
                    },
                    "template": {"title": "Gender", "hideSwitch": true, "hideRemoveButton": true},
                    "format": {"output": "codes"}
                },
                "special_condition": {
                    "cl": {"uid": "GIFT_SpecialConditions_filter"},
                    "selector": {"id": "input", "type": "checkbox", "default": ["1", "2", "3", "4"]},
                    "template": {"title": "Special Condition", "hideSwitch": true, "hideRemoveButton": true},
                    "dependencies": {
                        "@gender,age": [{
                            "id": "disableSpecialCondition",
                            "event": "select",
                            "args": {
                                "payloadIncludes": ["gender", "age", "ageGranularity"],
                                "forbiddenGender": "1",
                                "forbiddenAgeGranularity": "month",
                                "threshold": 14
                            }
                        }]
                    },
                    "constraints": {"presence": {"message": "Please select at least one value."}},
                    "format": {"output": "codes"}
                },
                "ageGranularity": {
                    "selector": {
                        "id": "input",
                        "type": "radio",
                        "source": [{"label": "Year", "value": "year"}, {"label": "Month", "value": "month"}],
                        "default": ["year"]
                    },
                    "template": {"title": "Age Granularity", "hideSwitch": true, "hideRemoveButton": true},
                    "format": {"output": "text"}
                },
                "age": {
                    "selector": {
                        "id": "range",
                        "config": {
                            "min": 0,
                            "max": 120,
                            "step": 0.5,
                            "from": 0,
                            "to": 120,
                            "type": "double",
                            "grid": true,
                            "force_edges": true
                        }
                    },
                    "template": {"title": "Age", "hideSwitch": true, "hideRemoveButton": true},
                    "dependencies": {"ageGranularity": [{"id": "updateAge", "event": "select"}]},
                    "format": {"output": "number"}
                },
                "country": {
                    "cl": {"uid": "GAUL0", "version": "2014"},
                    "selector": {"id": "tree", "hideSummary": true, "sort": true},
                    "template": {"title": "Country", "hideSwitch": true, "hideRemoveButton": true},
                    "format": {"metadataAttribute": "meContent.seCoverage.coverageGeographic", "output": "codes"}
                },
                "time": {
                    "selector": {
                        "id": "range",
                        "config": {"min": 1983, "max": 2016, "type": "double", "grid": true, "force_edges": true}
                    },
                    "template": {"title": "Time", "hideSwitch": true, "hideRemoveButton": true},
                    "format": {"metadataAttribute": "meContent.seCoverage.coverageTime", "output": "time"}
                },
                "referenceArea": {
                    "cl": {"uid": "GIFT_ReferenceArea_filter"},
                    "selector": {
                        "id": "input",
                        "type": "radio",
                        "source": [{"label": "All", "value": "none"}],
                        "default": ["none"]
                    },
                    "template": {
                        "title": "Geographical/Administrative coverage",
                        "hideSwitch": true,
                        "hideRemoveButton": true
                    },
                    "format": {"metadataAttribute": "meContent.seReferencePopulation.referenceArea", "output": "codes"}
                },
                "coverageSector": {
                    "cl": {"uid": "GIFT_CoverageSector_filter"},
                    "selector": {
                        "id": "input",
                        "type": "radio",
                        "source": [{"label": "All", "value": "none"}],
                        "default": ["none"]
                    },
                    "template": {"title": "Coverage Sector", "hideSwitch": true, "hideRemoveButton": true},
                    "format": {"metadataAttribute": "meContent.seCoverage.coverageSectors", "output": "codes"}
                },
                "foodex2_code": {
                    "cl": {"uid": "GIFT_Foods", "level": 2},
                    "selector": {"id": "tree", "hideSummary": true},
                    "template": {"title": "Food Items", "hideSwitch": true, "hideRemoveButton": true}
                }
            },
            "selectorsDependencies": {},
            "cache": false,
            "environment": "production",
            "hideCloseButton": true,
            template: ""
        }

        var catalog = this.createCatalog($.extend(true, {
            el: s.STANDARD
        }, model));
    };

    Dev.prototype._renderAngola = function () {

        var catalog = this.createCatalog({
            el: s.STANDARD,
            lang: lang,
            environment: environment,
            defaultSelectors: ['resourceType', 'contextSystem'],
            hideCloseButton: true,
            actions: ["download", 'view'],
            pluginRegistry: {
                contextSystem: {
                    selector: {
                        id: "dropdown",
                        source: [
                            {value: "cstat_ago", label: "CountrySTAT Angola"}
                        ],
                        default: ["cstat_ago"],
                        hideSummary: true,
                        config: {
                            plugins: ['remove_button'],
                            mode: 'multi'
                        }
                    },

                    template: {
                        hideRemoveButton: false
                    },

                    format: {
                        output: "enumeration",
                        metadataAttribute: "dsd.contextSystem"
                    }
                }
            }
        });
    };

    Dev.prototype._renderTraining = function () {

        var catalog = this.createCatalog({
            el: s.STANDARD,
            lang: lang,
            environment: environment,
            pluginRegistry: {
                contextSystem: {
                    selector: {
                        id: 'dropdown',
                        source: [
                            {value: "cstat_training", label: "CountrySTAT Training"}
                        ],
                        default: ["cstat_training"]
                    }
                },
                dataDomain: {
                    selector: {
                        id : "dropdown",
                        config : {
                            plugins: ["remove_button"], //in combination with mode:"multi" create a "X" button to remove items
                            mode: "multi"
                        }
                    },
                    cl : {
                        uid:  "CSTAT_Core"
                    },
                    format : {
                        output : "codes",
                        metadataAttribute: "meContent.seCoverage.coverageSectors"
                    }

                },
                referencePeriod: {
                    selector: {
                        id : "dropdown",
                        config: {
                            plugins: ["remove_button"], //in combination with mode:"multi" create a "X" button to remove items
                        },
                        sort: function (a, b) {
                            var hash = {  9:1, 6:2, 4:3, 3:4, 14:5, 13:6, 12:7, 11:8, 10:9, 8:10, 7:11, 5:12, 2:13, 1:14 };
                            return hash[a.value] - hash[b.value];
                        }

                    },
                    cl : {
                        uid: "FAO_Period_cstat",
                        version: "1.0"
                    },
                    format : {
                        output : "codes",
                        metadataAttribute: "meContent.seReferencePopulation.referencePeriod"
                    }
                },
                freeText: {
                    selector : {
                        id : "input",
                        type : "text"
                    },
                    template : {
                        footer: ""
                    },
                    format : {
                        output : "freeText",
                        metadataAttribute: "freetext"
                    }
                }
            },
            baseFilter: {
                "dsd.contextSystem": {"enumeration": ["cstat_training"]},
                "meContent.resourceRepresentationType": {"enumeration": ["dataset"]}
            },
            defaultSelectors: ["freeText", "dataDomain", "referenceArea"],
            menuExcludedItems: ["accessibility"],
            findServiceParams: {
                engine: ['cstat','fenix'],
                full: true,
                order : "meMaintenance.seUpdate.updateDate:desc" //order by last update
            }
        })

    };


    Dev.prototype._renderGift = function () {


        var model = {
            "defaultSelectors": ["country", "time", "referenceArea", "coverageSector", "foodex2_code", "gender", "special_condition", "ageGranularity", "age"],
            "columns": {
                "title": {"path": "title", "type": "i18n", "title": "Title", "width": "50%"},
                "sampleSize": {"path": "sampleSize", "title": "Sample Size", "width": "20%"}
            },
            "searchService": {"serviceProvider": "//fenixservices.fao.org/gift/statistics/", "findService": "filter"},
            "actions": ["download", "metadata"],
            "overridePluginRegistry": true,
            "pluginRegistry": {
                "gender": {
                    "cl": {"uid": "GIFT_Gender_filter"},
                    "selector": {
                        "id": "input",
                        "type": "radio",
                        "source": [{"label": "All", "value": "none"}],
                        "default": ["none"]
                    },
                    "template": {"title": "Gender", "hideSwitch": true, "hideRemoveButton": true},
                    "format": {"output": "codes", "uid": "GIFT_Gender"}
                },
                "special_condition": {
                    "cl": {"uid": "GIFT_SpecialConditions_filter"},
                    "selector": {"id": "input", "type": "checkbox", "default": ["1", "2", "3", "4"]},
                    "template": {"title": "Special Condition", "hideSwitch": true, "hideRemoveButton": true},
                    "dependencies": {
                        "@gender,age": [{
                            "id": "disableSpecialCondition",
                            "event": "select",
                            "args": {
                                "payloadIncludes": ["gender", "age", "ageGranularity"],
                                "forbiddenGender": "1",
                                "forbiddenAgeGranularity": "month",
                                "threshold": 14
                            }
                        }]
                    },
                    "constraints": {"presence": {"message": "Please select at least one value."}},
                    "format": {"output": "codes", "uid": "GIFT_SpecialConditions"}
                },
                "ageGranularity": {
                    "selector": {
                        "id": "input",
                        "type": "radio",
                        "source": [{"label": "Year", "value": "year"}, {"label": "Month", "value": "month"}],
                        "default": ["year"]
                    },
                    "template": {"title": "Age Granularity", "hideSwitch": true, "hideRemoveButton": true},
                    "format": {"output": "text"}
                },
                "age": {
                    "selector": {
                        "id": "range",
                        "config": {
                            "min": 0,
                            "max": 120,
                            "step": 0.5,
                            "from": 0,
                            "to": 120,
                            "type": "double",
                            "grid": true,
                            "force_edges": true
                        }
                    },
                    "template": {"title": "Age", "hideSwitch": true, "hideRemoveButton": true},
                    "dependencies": {"ageGranularity": [{"id": "updateAge", "event": "select"}]},
                    "format": {"output": "number"}
                },
                "country": {
                    "cl": {"uid": "GAUL0", "version": "2014"},
                    "selector": {"id": "tree", "hideSummary": true, "sort": true},
                    "template": {"title": "Country", "hideSwitch": true, "hideRemoveButton": true},
                    "format": {
                        "metadataAttribute": "meContent.seCoverage.coverageGeographic",
                        "output": "codes",
                        "uid": "GAUL"
                    }
                },
                "time": {
                    "selector": {
                        "id": "range",
                        "config": {"min": 1980, "max": 2016, "type": "double", "grid": true, "force_edges": true}
                    },
                    "template": {"title": "Time", "hideSwitch": true, "hideRemoveButton": true},
                    "dependencies": {"country": [{"id": "test", "event": "select"}]},
                    "format": {"metadataAttribute": "meContent.seCoverage.coverageTime", "output": "time"}
                },
                "referenceArea": {
                    "cl": {"uid": "GIFT_ReferenceArea_filter"},
                    "selector": {
                        "id": "input",
                        "type": "radio",
                        "source": [{"label": "All", "value": "none"}],
                        "default": ["none"]
                    },
                    "template": {
                        "title": "Geographical/Administrative coverage",
                        "hideSwitch": true,
                        "hideRemoveButton": true
                    },
                    "format": {
                        "metadataAttribute": "meContent.seReferencePopulation.referenceArea",
                        "output": "codes",
                        "uid": "GIFT_ReferenceArea"
                    }
                },
                "coverageSector": {
                    "cl": {"uid": "GIFT_CoverageSector_filter"},
                    "selector": {
                        "id": "input",
                        "type": "radio",
                        "source": [{"label": "All", "value": "none"}],
                        "default": ["none"]
                    },
                    "template": {"title": "Coverage Sector", "hideSwitch": true, "hideRemoveButton": true},
                    "format": {
                        "metadataAttribute": "meContent.seCoverage.coverageSectors",
                        "output": "codes",
                        "uid": "GIFT_CoverageSector"
                    }
                },
                "foodex2_code": {
                    "cl": {"uid": "GIFT_Foods", "level": 2},
                    "selector": {"id": "tree", "hideSummary": true},
                    "template": {"title": "Food Items", "hideSwitch": true, "hideRemoveButton": true}
                }
            },
            "selectorsDependencies": {},
            "cache": false,
            "environment": "production",
            el: s.STANDARD,
            lang: lang,
            template: Template,
            hideCloseButton: true,
            prepareQuery: function (metavalues, fenixvalues, values) {
                var exclusions = ['country', 'time', 'referenceArea', 'coverageSector', 'ageGranularity', 'age'];
                var granularity = values.values['ageGranularity'][0];

                fenixvalues['age_' + granularity] = fenixvalues['age'];

                for (var idx in exclusions) {
                    var remove = exclusions[idx];
                    if (fenixvalues[remove]) {
                        delete fenixvalues[remove];
                    }
                }

                var final = $.extend(true, {}, metavalues, fenixvalues);

                return final;

            },
        }

        var catalog = this.createCatalog(model);
    };

    //Utils

    Dev.prototype.createCatalog = function (params) {

        var instance = new Catalog(params);

        catalogs.push(instance);

        return instance;
    };

    // utils

    Dev.prototype._importThirdPartyCss = function () {

        //Bootstrap
        require('bootstrap/dist/css/bootstrap.css');

        //dropdown selector
        require("../../../node_modules/selectize/dist/css/selectize.bootstrap3.css");
        // fenix-ui-filter
        require("../../../node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");
        // fenix-ui-dropdown
        require("../../../node_modules/fenix-ui-dropdown/dist/fenix-ui-dropdown.min.css");

        // bootstrap-table
        require("../../../node_modules/bootstrap-table/dist/bootstrap-table.min.css");

        //tree selector
        require("../../../node_modules/jstree/dist/themes/default/style.min.css");
        //range selector
        require("../../../node_modules/ion-rangeslider/css/ion.rangeSlider.css");
        require("../../../node_modules/ion-rangeslider/css/ion.rangeSlider.skinHTML5.css");
        //time selector
        require("../../../node_modules/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css");

    };

    return new Dev();

});