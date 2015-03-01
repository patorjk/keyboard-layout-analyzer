/*
    Service for storing globally available data
*/

var appServices = appServices || angular.module('kla.services', []);

appServices.factory('textPresets', ['$http',
    function($http) {
        var service = {};

        service.load = function(preset) {
            var promise = $http.get('./presets/'+preset+'.txt').then(function (response) {
                return response.data;
            });
            return promise;
        };

        return service;
    }

])