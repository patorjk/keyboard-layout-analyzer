/*
    Defines the <keyboard> tag
*/

var appDirectives = appDirectives || angular.module('kla.directives', []);

appDirectives.directive('keyboard', [
    'keyboards',
    function(keyboards) {
        return {
            restrict: 'E',
            scope: {
                'name': '@name'
            },
            controller: function($scope) {

            },

            link: function(scope, element, attrs, controller) {
                keyboards.registerKeyboard( attrs.name, $(element).attr('id') );
            }
        };
    }
]);
