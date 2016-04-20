/*global define*/

define(function () {

    'use strict';

    var SERVER = 'http://fenix.fao.org/';

    return {

        SERVER: SERVER,
        SERVICE_PROVIDER : SERVER + "d3s_dev/",
        FILTER_SERVICE : "msd/resources/find",
        
        PER_PAGE : 10,

        RESULT_ACTIONS : ['select']
        
    }

});