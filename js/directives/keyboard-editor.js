/*
    Defines the <keyboardeditor> tag
*/

var appDirectives = appDirectives || angular.module('kla.directives', []);

appDirectives.directive('keyboardeditor', [
    '$timeout',
    'keyboards',
    function($timeout, keyboards) {
        var instance = 0;
        return {
            restrict: 'E',
            
            scope: {
                'name': '@name',
                'current': '='
            },

            template: '<div id="{{id}}"></div>',

            controller: function($scope) {
                $scope.id = 'kla-kb-container-'+instance++;
            },

            link: function(scope, element, attrs, controller) {
                $timeout(function() {
                    keyboards.registerKeyboard( attrs.name, scope.id );//$(element).attr('id')
                }, 0);

                scope.$watch('current', function(newVal, oldVal) {
                    if (newVal === parseInt(scope.name, 10)) {
                        $('#'+scope.id).removeClass('hide');
                        $('#'+scope.id).addClass('showinline');
                    } else {
                        $('#'+scope.id).removeClass('showinline');
                        $('#'+scope.id).addClass('hide');
                    }
                }, true);
            }
        };
    }
]);
