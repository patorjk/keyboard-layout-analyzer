/*
    Filter for capitalizing the first letter of a word
*/

var appFilters = appFilters || angular.module('kla.filters', []);

appFilters.filter('capitalize', function() {
    return function(input, scope) {
        if (input) {
            return input.substring(0,1).toUpperCase() + input.substring(1);
        }
    };
});