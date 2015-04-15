/*global define*/
define(function () {

    'use strict';

    return {
        SERVICES_BASE_ADDRESS: "http://fenix.fao.org/d3s_dev/msd",
        //SERVICES_BASE_ADDRESS: "http://fenix.fao.org/d3s/msd",
        SERVICE_GET_DATA_METADATA: {service: "resources", queryParams: {full: true, dsd: true}},
        SERVICE_SAVE_METADATA: {service: "resources/metadata"},
        SERVICE_SAVE_DSD: {service: "resources/dsd"},
        SERVICE_SAVE_DATA: {service: "resources"},

        service_getDataAndMetaURL: function (uid, version) {
            var addr = pathConcatenation(this.SERVICES_BASE_ADDRESS, this.SERVICE_GET_DATA_METADATA.service);
            return this.service_appendUID_Version(addr, uid, version);
            //return pathConcatenation(this.SERVICES_BASE_ADDRESS, this.SERVICE_GET_DATA_METADATA);
        },
        service_saveMetadataURL: function () {
            return pathConcatenation(this.SERVICES_BASE_ADDRESS, this.SERVICE_SAVE_METADATA.service);
        },
        service_saveDsdURL: function () {
            return pathConcatenation(this.SERVICES_BASE_ADDRESS, this.SERVICE_SAVE_DSD.service);
        },
        service_saveDataURL: function () {
            return pathConcatenation(this.SERVICES_BASE_ADDRESS, this.SERVICE_SAVE_DATA.service);
        },

        service_appendUID_Version: function (addr, uid, version) {
            if (!uid)
                return addr;
            if (version)
                return addr + "/" + uid + "/" + version;
            return addr + "/uid/" + uid;
        }
    };

    /*Aux fns*/

    function pathConcatenation(path1, path2) {
        if (path1.charAt(path1.length - 1) == '/') {
            return path1 + path2;
        }
        return path1 + "/" + path2;
    }

});
