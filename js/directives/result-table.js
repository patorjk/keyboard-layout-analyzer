/*
    Defines the <klaresulttable> tag
*/

var appDirectives = appDirectives || angular.module('kla.directives', []);

appDirectives.directive('resulttable', [
    function() {
        return {
            restrict: 'E',
            scope: {
                'source':'='
            },
            templateUrl: './partials/result-table.htm',
            controller: function($scope, $element) {
                $scope.format = function(num) {
                    switch ($scope.source.units) {
                        case 'Key Presses':
                            return num.toFixed(0);
                        default: 
                            return num.toFixed(1);
                    }
                };
            }
        }
    }
]); 