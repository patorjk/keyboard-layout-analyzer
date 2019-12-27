/*
    Defines the <klaresulttable> tag
*/

var appDirectives = appDirectives || angular.module('kla.directives', []);

appDirectives.directive('resultoptions', [
    function() {
        var instance = 0;
        return {
            restrict: 'E',
            scope: {
                'source':'=',
                'displayopts':'@'
            },
            templateUrl: './partials/result-options.htm',
            controller: function($scope) {
                $scope.settings = {};
                $scope.settings.id = instance++;
                $scope.settings.showDisplayType = ($scope.displayopts === 'false' || $scope.displayopts === false) ? 'none' : 'inline-block';

                $scope.$watch('source.units', function(newVal, oldVal, scope) {
                    if (scope.also1) {
                        scope.also1.units = newVal;
                    }
                    if (scope.also2) {
                        scope.also2.units = newVal;
                    }
                }, true);

                if ( !$scope.source ) return;

                var idx = 0;
                for (idx = 0; idx < $scope.source.rawSeriesData.length; idx++) {
                    $scope.$watch('source.rawSeriesData['+idx+'].visible', (function() {
                        var newIdx = idx;
                        return function(newVal, oldVal, scope) {
                            // TODO: crazy bad hack, but it works
                            if (scope.source.rawSeriesData.dups) {
                                scope.source.rawSeriesData.dups[newIdx].visible = newVal;
                            }
                            if (scope.source.rawSeriesData.nodups) {
                                scope.source.rawSeriesData.nodups[newIdx].visible = newVal;
                            }
                        }
                    })(), true);
                }
            } // end controller
        }
    }
]); 