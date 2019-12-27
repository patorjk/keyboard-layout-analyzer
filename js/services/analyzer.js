/*
	Service for computing keyboard efficiency

    It is simply a wrapper around the KLA.Analyzer singleton
*/

var appServices = appServices || angular.module('kla.services', []);

appServices.factory('analyzer', [
	function() {
        return KLA.Analyzer;
	}

])