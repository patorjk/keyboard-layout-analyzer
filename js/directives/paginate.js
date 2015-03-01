/*
    Defines the <keyboarddisplay> tag
*/

var appDirectives = appDirectives || angular.module('kla.directives', []);

appDirectives.directive('paginate', [
    function() {
        var instance = 0;

        return {
            restrict: 'E',
            
            scope: {
                start: '@',
                stop: '@',
                handler: '='
            },

            templateUrl: 'partials/paginate.htm',

            controller: function($scope, $element) {
                $scope.start = parseInt($scope.start, 10);
                $scope.stop = parseInt($scope.stop, 10);
                $scope.maxVal = $scope.stop - $scope.start;
                $scope.current = 0;

                $scope.handleNav = function(evt, start, idx) {

                    idx = (idx === 'next') ? $scope.current + 1 : idx;
                    idx = (idx === 'prev') ? $scope.current - 1 : idx;

                    if (idx === $scope.current) return;
                    if (idx < 0) return;
                    if (idx > $scope.maxVal) return;

                    $scope.current = idx;

                    if (typeof $scope.handler !== 'undefined') {
                        $scope.handler(evt, $scope.start, idx); // callback
                    }
                }  
            },

            link: function(scope, element, attrs, controller) {

            }
        };
    }
]);
