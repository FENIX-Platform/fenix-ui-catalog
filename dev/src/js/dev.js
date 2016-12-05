define([
    'loglevel',
    'jquery',
    'underscore',
    './template.hbs',
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

        log.setLevel('trace');

        this.start();
    }

    Dev.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Dev.prototype._render = function () {

        //this._renderGift();

       this._renderStandard();

        //this._renderAngola();
    };

    Dev.prototype._renderStandard = function () {

        var catalog = this.createCatalog({
            el: s.STANDARD,
            lang : lang,
            cache: false,
            environment: "production",
                pluginRegistry: {
                    contextSystem: {
                        selector: {
                            source: [
                                {value: "cstat_cog", label: "CountrySTAT Congo"}
                            ],
                            default: ["cstat_cog"]
                        }
                    },
                    dataDomain: {
                        cl: {
                            uid: "CountrySTAT_Indicators",
                            level: 1,
                            levels: 1
                        }
                    }
                },
                baseFilter: {
                    "dsd.contextSystem": {"enumeration": ["cstat_cog"]},
                    "meContent.resourceRepresentationType": {"enumeration": ["dataset"]}
                },
                defaultSelectors: ["referenceArea", "dataDomain"],
                menuExcludedItems: ["accessibility"],
            actions: ["download", 'view'],
            //baseFilter : { test : "test"}
        });
    };

    Dev.prototype._renderAngola = function () {

        var catalog = this.createCatalog({
            el: s.STANDARD,
            lang : lang,
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


    Dev.prototype._renderGift = function () {

        var catalog = this.createCatalog({
            el: s.STANDARD,
            lang : lang,
            environment: environment,
            hideCloseButton: true,
            prepareQuery : function(metavalues, fenixvalues, values){
                var exclusions = ['country', 'time', 'referenceArea', 'coverageSector', 'ageGranularity', 'age'];
                var granularity = values.values['ageGranularity'][0];

                fenixvalues['age_'+granularity] = fenixvalues['age'];

                for(var idx in exclusions){
                    var remove = exclusions[idx];
                    if(fenixvalues[remove]){
                        delete fenixvalues[remove];
                    }
                }

                var final = $.extend(true, {}, metavalues, fenixvalues);

                return final;

            },
            defaultSelectors: ['country', 'time', 'referenceArea', 'coverageSector', 'foodex2_code', 'gender',
                'special_condition', 'ageGranularity', 'age'
            ],
            template: Template,

            columns : {
                title: {
                    path : "title",
                    type: "i18n",
                    title : "Title",
                    width: "60%"
                },
                sampleSize : {
                    path : "sampleSize",
                    title : "Sample Size",
                    width: "20%"
                }
            },

            searchService : {
                serviceProvider:'//fenixservices.fao.org/gift/statistics/',
                findService: 'filter'
            },

            actions: ["download", 'metadata'],
            selectorsDependencies: {

                disableSpecialCondition: function (payload, o) {

                    var threshold = parseInt(o.args.threshold),
                        forbiddenGender = o.args.forbiddenGender,
                        forbiddenAgeGranularity = o.args.forbiddenAgeGranularity,
                        selectedValues = payload.values || {},
                    //age selector
                        to = _.findWhere(selectedValues.age, {parent: "to"}) || {},
                        toValue = !isNaN(parseInt(to.value)) ? parseInt(to.value) : -1,
                    //gender selector
                        gender = selectedValues.gender,
                        toDisable = false,
                    //age granularity
                        ageGranularity = selectedValues.ageGranularity[0];

                    //if 'to' value is less then threshold
                    if (toValue < threshold) {
                        toDisable = true
                    }

                    //if gender is forbidden
                    if (_.contains(gender, forbiddenGender)) {
                        toDisable = true
                    }

                    //if 'to' value is less then threshold
                    if (forbiddenAgeGranularity === ageGranularity) {
                        toDisable = true
                    }

                    if (!!toDisable) {
                        this._callSelectorInstanceMethod(o.target, "disable");
                    } else {
                        this._callSelectorInstanceMethod(o.target, "enable");
                    }

                },

                updateAge: function (payload, o) {

                    var granularity = payload.values[0],
                        yearConfig = {
                            min: 0,
                            max: 120,
                            from: 0,
                            to: 120,
                            step: 0.5
                        },
                        monthConfig = {
                            min: 0,
                            max: 60,
                            from: 0,
                            to: 60,
                            step: 1
                        };

                    switch (granularity.toLowerCase()) {
                        case "year" :
                            this._callSelectorInstanceMethod(o.target, "update", yearConfig);
                            break;
                        case "month" :
                            this._callSelectorInstanceMethod(o.target, "update", monthConfig);
                            break;
                    }
                }
            },
            overridePluginRegistry: true,
            pluginRegistry: {
                country: {
                    cl: {
                        uid: "GAUL0",
                        version: "2014"
                    },
                    selector: {
                        id: "tree",
                        hideSummary: true
                    },

                    template: {
                        title: "Country",
                        hideSwitch: true,
                        hideRemoveButton: true
                    },

                    format: {
                        metadataAttribute: "meContent.seCoverage.coverageGeographic",
                        output: "codes"
                    }
                },

                time: {

                    selector: {
                        id: "range",
                        config: {
                            min: 1983,
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
                        title: "Time",
                        hideSwitch: true,
                        hideRemoveButton: true
                    },

                    dependencies: {
                        country: [{id: "test", event: "select"}]
                    },

                    format: {
                        metadataAttribute: "meContent.seCoverage.coverageTime",
                        output: "time"
                    }
                },

                referenceArea: {

                    cl: {
                        uid: "GIFT_ReferenceArea_filter"
                    },

                    selector: {
                        id: "input",
                        type: "radio",
                        source: [
                            {label: "All", value: "none"}
                        ],
                        default: ["none"]
                    },
                    template: {
                        title: "Reference Area",
                        hideSwitch: true,
                        hideRemoveButton: true
                    },

                    format: {
                        metadataAttribute: "meContent.seReferencePopulation.referenceArea",
                        output : "codes"
                    }
                },

                coverageSector: {

                    cl: {
                        uid: "GIFT_CoverageSector_filter"
                    },

                    selector: {
                        id: "input",
                        type: "radio",
                        source: [
                            {label: "All", value: "none"}
                        ],
                        default: ["none"]

                    },
                    template: {
                        title: "Coverage Sector",
                        hideSwitch: true,
                        hideRemoveButton: true
                    },

                    format: {
                        metadataAttribute: "meContent.seCoverage.coverageSectors",
                        output: "codes"
                    }
                },

                foodex2_code: {

                    cl: {
                        uid: "GIFT_Foods",
                        level: 2
                    },

                    selector: {
                        id: "tree",
                        hideSummary: true
                    },
                    template: {
                        title: "Food",
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                },
                gender: {

                    cl: {
                        uid: "GIFT_Gender_filter"
                    },

                    selector: {
                        id: "input",
                        type: "radio",
                        source: [
                            {label: "All", value: "none"}
                        ],
                        default: ["none"]
                    },
                    template: {
                        title: "Gender",
                        hideSwitch: true,
                        hideRemoveButton: true
                    },

                    format: {
                        output: "codes"
                    }
                },

                special_condition: {

                    cl: {
                        uid: "GIFT_SpecialConditions_filter"
                    },

                    selector: {
                        id: "input",
                        type: "checkbox",
                        default: ["1", "2", "3", "4"]
                    },

                    template: {
                        title: "Special Condition",
                        hideSwitch: true,
                        hideRemoveButton: true
                    },

                    dependencies: {
                        "@gender,age": [
                            {
                                id: "disableSpecialCondition",
                                event: "select",
                                args: {
                                    payloadIncludes: ["gender", "age", "ageGranularity"],
                                    forbiddenGender: "1",
                                    forbiddenAgeGranularity: "month",
                                    threshold: 14
                                }
                            }
                        ]
                    },

                    constraints: {
                        presence: {message: "Please select at least one value."}
                    },

                    format: {
                        output: "codes"
                    }
                },

                ageGranularity: {
                    selector: {
                        id: "input",
                        type: "radio",
                        source: [
                            {label: "Year", value: "year"},
                            {label: "Month", value: "month"}
                        ],
                        default: ["year"]
                    },

                    template: {
                        title: "Age Granularity",
                        hideSwitch: true,
                        hideRemoveButton: true
                    },

                    format: {
                        output: "text"
                    }
                },

                age: {

                    selector: {
                        id: "range",
                        config: {
                            min: 0,
                            max: 120,
                            step: 0.5,
                            from: 0,
                            to: 120,
                            type: "double",
                            grid: true,
                            force_edges: true,
                            prettify: function (num) {
                                return num;
                            }
                        }
                    },

                    template: {
                        title: "Age",
                        hideSwitch: true,
                        hideRemoveButton: true
                    },

                    dependencies: {
                        ageGranularity: [{id: "updateAge", event: "select"}]
                    },

                    format: {
                        output: "number"
                    }
                }
            }
        });
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