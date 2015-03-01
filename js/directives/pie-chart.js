/*
    Defines the <keyboard> tag
*/

var appDirectives = appDirectives || angular.module('kla.directives', []);

appDirectives.directive('piechart', [
    function() {

        var instance = 0;

        return {
            restrict: 'E',

            scope: {
                'width': '@width',
                'height': '@height',
                'source':'=',
                'series':'='
            },

            template: '<div id="piechart-{{id}}" class="jqplot-target"></div>',

            controller: function($scope, $element) {
                var pieData = [];

                $scope.id = instance++;
                $scope.chartId = 'piechart-' + $scope.id;
                $scope.plot = null;

                $scope.getFormattedPieChartData = function() {
                    var ii, elm, pieData = [];
                    for (ii = 0; ii < $scope.source.seriesData[$scope.series].length; ii++) {
                        elm = [];
                        //elm.push( $scope.source.displayLabels[$scope.source.displayType][ii]);
                        elm.push( $scope.source.displayData[$scope.source.displayType][ii].label );
                        elm.push( $scope.source.seriesData[$scope.series][ii]);
                        pieData.push(elm);
                    }
                    return pieData;
                };

                $scope.updateChart = function() {

                    if ( typeof $scope.source === 'undefined') return;
                    if ( typeof $scope.series === 'undefined') return;

                    pieData = $scope.getFormattedPieChartData();;

                    var pieColors = [];
                    var ii = 0;
                    for (ii = 0; ii < $scope.source.displayData[$scope.source.displayType].length; ii++) {
                        pieColors.push( $scope.source.displayData[$scope.source.displayType][ii].color );
                    }

                    var plotOpts = {
                        grid: {
                            background: '#ecf0f1'
                        },
                        seriesDefaults:{
                            renderer:$.jqplot.PieRenderer,
                            rendererOptions: {
                                shadowDepth: 2,
                                showDataLabels: true,
                                startAngle:-90
                            }
                        },
                        legend: {
                            show: true,
                            placement: 'outsideGrid'
                        },
                        seriesColors: pieColors,
                    };

                    $('#'+ $scope.chartId).width($scope.width).height($scope.height);
                    $('#'+ $scope.chartId).css({
                        color:'#2a2a2a',
                        position:'relative'
                    })

                    if ( $scope.plot ) {
                        $scope.plot.destroy();
                    }
                    $scope.plot = $.jqplot($scope.chartId, [pieData], plotOpts);

                    $('#'+ $scope.chartId ).bind('jqplotDataHighlight', 
                        function (ev, seriesIndex, pointIndex, data ) {
                            $('#piechart-'+$scope.id+' .jqplot-table-legend tr').css({
                                'background-color': 'transparent'
                            })
                            var trIndex = pointIndex + 1;
                            $('#piechart-'+$scope.id+' .jqplot-table-legend tr:nth-child('+trIndex+')').css({
                                'background-color': '#ffffff'
                            })
                        }
                    );

                    $('#'+ $scope.chartId).bind('jqplotDataUnhighlight', 
                        function (ev) {
                            $('#piechart-'+$scope.id+' .jqplot-table-legend tr').css({
                                'background-color': 'transparent'
                            })
                        }
                    );
                }; // end updateChart

            },

            link: function(scope, element, attrs, controller) {
                scope.$watch('source.dirty', function(newVal, oldVal) {
                    scope.updateChart();
                }, true);

            }
        };
    }
]);
