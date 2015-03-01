/*
    Defines the <keyboarddisplay> tag
*/

var appDirectives = appDirectives || angular.module('kla.directives', []);

appDirectives.directive('keyboarddisplay', [
    '$timeout',
    function($timeout) {
        var instance = 0;
        return {
            restrict: 'E',
            
            scope: {
                layout: '='
            },

            template: '<div id="{{id}}"></div>',

            controller: function($scope) {
                $scope.id = 'kla-kbd-container-'+instance++;
                $scope.keyboard = null;
            },

            link: function(scope, element, attrs, controller) {
                $timeout(function() {
                    if ( $('#'+scope.id).length === 0 ) return;

                    scope.keyboard = new KB.Keyboard({
                        container: scope.id,
                        layout: scope.layout,
                        type: 'display'
                    });
                }, 0);
            }
        };
    }
]);
