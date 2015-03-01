/*
    Service for storing globally available data
*/

var appServices = appServices || angular.module('kla.services', []);

appServices.factory('library', [
    function() {
        var me = {},
            data = {};

        me.get = function(prop) {
            if (typeof prop === 'undefined') {
                return data;
            } else {
                return data[prop];
            }
        };

        me.set = function(prop, val) {
            data[prop] = val;
        };

        return me;
    }

])