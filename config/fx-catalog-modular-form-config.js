/* global define */

define(function () {

    'use strict';

    return {

        "uid": {
            "id": "fx-uid-id",
            "type": "text",
            "container": "name-container",
            "cssclass": "name-class",
            "label": {
                "EN": "Uid",
                "DE": "Suche",
                "ES": "Búsqueda",
                "FR": "Recherchet"
            },
            "component": {
                "rendering": {
                    "placeholder": {
                        "EN": "Uid",
                        "DE": "uid",
                        "ES": "uid",
                        "FR": "uid"
                    },
                    "htmlattributes": {
                        "className": "form-control"
                    }
                }
            }
        },

        "resourceType": {
            "id": "fx-resourcestype-id",
            "type": "enumeration",
            "label": {
                "EN": "Resources Type",
                "DE": "Suche",
                "ES": "Búsqueda",
                "FR": "Recherchet"
            },

            "component": {
                "source": {
                    "uid": "RepresentationType"
                }
            }
        },

        "referenceArea": {
            "id": "fx-referenceArea-id",
            "type": "codes",
            "label": {
                "EN": "Reference Area",
                "ES": "Intervalo de tiempo",
                "DE": "Zeitbereich",
                "FR": "Intervalle de temps"
            },
            "component": {
                "source": {
                    "uid": "GAUL_ReferenceArea",
                    "version": "1.0"
                }
            }
        },

        "sector": {
            "id": "fx-sector-id",
            "type": "codes",
            "label": {
                "EN": "Sector",
                "ES": "Intervalo de tiempo",
                "DE": "Zeitbereich",
                "FR": "Intervalle de temps"
            },
            "component": {
                "source": {
                    "id": "value",
                    "uid": "CSTAT_Core"
                }
            }
        },

        "referencePeriod": {
            "id": "fx-referencePeriod-id",
            "type": "codes",
            "label": {
                "EN": "Reference Range",
                "ES": "Intervalo de tiempo",
                "DE": "Zeitbereich",
                "FR": "Intervalle de temps"
            },
            "component": {
                "source": {
                    "uid": "FAO_Period",
                    "version": "1.0"
                }
            }
        },

        "statusOfConfidentiality": {
            "id": "fx-statusOfConfidentiality-id",
            "type": "codes",
            "label": {
                "EN": "Status of Confidentiality",
                "ES": "Intervalo de tiempo",
                "DE": "Zeitbereich",
                "FR": "Intervalle de temps"
            },
            "component": {
                "source": {
                    "uid": "CL_CONF_STATUS",
                    "version": "1.0"
                }
            }
        },

        "region": {
            "id": "fx-region-id",
            "type": "tree",
            "cssclass": "region-css",
            "container": "region-container",
            "label": {
                "EN": "Region",
                "ES": "ES List",
                "FR": "FR List"
            },
            "details": {
                "cl": {
                    "uid": "GAUL0",
                    "version": "2014"
                }
            },
            "component": {
                "source": {
                    "datafields": [
                        {
                            "name": "label",
                            "map": "title>EN"
                        },
                        {
                            "name": "value",
                            "map": "code"
                        }
                    ],
                    "uid": "GAUL0",
                    "version": "2014",
                    "url": "http://fenix.fao.org/d3s_fenix/msd/codes/filter"
                },
                "rendering": {
                    "displayMember": "label",
                    "valueMember": "value",
                    "multiple": true,
                    "width": "100%",
                    "height": "100%"
                }
            }
        }

/*        , "version": {
            "id": "fx-version-id",
            "type": "version",
            "container": "name-container",
            "cssclass": "name-class",
            "label": {
                "EN": "Version",
                "DE": "Suche",
                "ES": "Búsqueda",
                "FR": "Recherchet"
            },
            "component": {
                "rendering": {
                    "placeholder": {
                        "EN": "Version",
                        "DE": "Version",
                        "ES": "Version",
                        "FR": "Version"
                    },
                    "htmlattributes": {
                        "className": "form-control"
                    }
                }
            }
        },

        "contact": {
            "id": "fx-contact-id",
            "type": "contact",
            "container": "contact-container",
            "cssclass": "contact",
            "label": {
                "EN": "Contact",
                "DE": "Suche",
                "ES": "Búsqueda",
                "FR": "Recherchet"
            },
            "details": {
                "cl": {
                    "uid": "ResponsiblePartyRole"
                }
            },
            "component": {
                "source": {
                    "url": "http://fenix.fao.org/d3s_fenix/msd/choices/ResponsiblePartyRole"
                },
                "rendering": {
                    "displayMember": "label",
                    "valueMember": "value",
                    "multiple": true,
                    "width": "100%",
                    "height": "100%"
                }

            }
        },*/

    };

});


