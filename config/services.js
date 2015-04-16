/*global define*/
define([
    'fx-cat-br/config/services-default'
], function (servicesDefault) {

    'use strict';

    var services = Object.create(servicesDefault);

    //Use the following example to override properties:
    //services.SERVICES_BASE_ADDRESS = "http://fenix.fao.org/d3s_dev2/msd";

    /*return {
        
    };*/
    return services;
});