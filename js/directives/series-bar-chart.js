/*
    Defines the <keyboard> tag
*/

var appDirectives = appDirectives || angular.module('kla.directives', []);

appDirectives.directive('seriesbarchart', ['$log',
    function($log) {

        var instance = 0;

        return {
            restrict: 'E',

            scope: {
                'width': '@width',
                'height': '@height',
                'source':'='
            },

            template: '<div id="seriesbarchart-{{id}}" class="jqplot-target"></div>',

            controller: function($scope, $element) {
                $scope.id = instance++;
                $scope.chartId = 'seriesbarchart-' + $scope.id;
                $scope.plot = null;

                var unitDisplay = function(unitType) {
                    switch (unitType) {
                        case 'Centimeters': return 'cm';
                        case 'Meters': return 'm';
                        case 'Miles': return 'mi';
                        case 'Feet': return 'ft';
                        case 'Percent': return '%';
                        default: return '';
                    }
                };
                var unitsFixedTo = function(unitType) {
                    switch (unitType) {
                        case 'keypresses': return 0;
                        default: return 1;
                    }
                };

                $scope.updateChart = function() {
                    if ( typeof $scope.source === 'undefined') return;
                    var seriesData = $scope.source.seriesData;

                    // create tool tip if needed
                    if ( $('#chartpseudotooltip').length === 0) {
                        $(document.body).append('<div id="chartpseudotooltip" class="kla-chart-tooltip"></div>');
                    }

                    //$log.debug('update chart');
                    //$log.debug($scope.source.seriesData);
                    if (seriesData.length === 0) {
                        //$log.debug('no data to draw');
                        if ( $scope.plot ) {
                            $scope.plot.destroy();
                        }
                        return;
                    }

                    var ticks = $scope.source.seriesData.labels;
                    var series = [];
                    var idx = 0;
                    while ( $scope.source.seriesData[idx] ) {
                        series.push({label:$scope.source.seriesData.seriesLabels[idx], color: $scope.source.seriesData.seriesColors[idx]});
                        idx++;
                    }

                    var plotOpts = {

                        grid: {
                            background: '#ecf0f1'
                        },

                        seriesDefaults:{
                            renderer:$.jqplot.BarRenderer,
                            rendererOptions: {
                                fillToZero: true,
                                barWidth: null,
                                barPadding:3,
                                shadowDepth: 2
                            }
                        },

                        series: series,

                        legend: {
                            show: true,
                            placement: 'outsideGrid'
                        },

                        axes: {
                            xaxis: {
                                renderer: $.jqplot.CategoryAxisRenderer,
                                ticks: ticks
                            },
                            yaxis: {
                                pad: 1.05,
                                tickOptions: {formatString: '%d'+unitDisplay($scope.source.units)},
                                min: 0
                            }
                        }
                    };

                    $('#'+ $scope.chartId).width($scope.width).height($scope.height);

                    if ( $scope.plot ) {
                        $scope.plot.destroy();
                    }
                    $scope.plot = $.jqplot($scope.chartId, seriesData, plotOpts);

                    $('#'+ $scope.chartId ).bind('jqplotDataHighlight', 
                        function (ev, seriesIndex, pointIndex, data ) {
                            var mouseX = ev.pageX ;
                            var mouseY = ev.pageY - 38;
                            var items = $scope.source.seriesData.seriesLabels;

                            $('#chartpseudotooltip').html( items[seriesIndex] + ', ' + 
                                data[1].toFixed( unitsFixedTo($scope.source.units) ) + 
                                unitDisplay($scope.source.units) );

                            var cssObj = {
                                'position' : 'absolute',
                                'left' : mouseX + 'px',
                                'top' : mouseY + 'px',
                                'display':'block'
                            };
                            $('#chartpseudotooltip').css(cssObj);
                        }
                    );

                    $('#'+ $scope.chartId).bind('jqplotDataUnhighlight', 
                        function (ev) {
                            $('#chartpseudotooltip').html('');
                            $('#chartpseudotooltip').css({
                                'display':'none'
                            });
                        }
                    );
                }; // end updateChart

            },

            link: function(scope, element, attrs, controller) {
                scope.$watch('source.seriesData + source.dirty', function(newVal, oldVal) {
                    scope.updateChart();
                }, true);

            }
        };
    }
]);
