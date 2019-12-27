/*
    Defines the <keyboarddisplay> tag
*/

var appDirectives = appDirectives || angular.module('kla.directives', []);

appDirectives.directive('keyboardheatmap', [
    '$timeout',
    function($timeout) {
        var instance = 0;

        var getHeatmapData = function(keyData) {
            var ii = 0, 
                len = keyData.length,
                max = 0,
                data = [];
            for (ii = 0; ii < len; ii++) {
                data.push({
                    x: keyData[ii].cx,
                    y: keyData[ii].cy,
                    count: keyData[ii].count || -1
                });
                if ( max < keyData[ii].count ) {
                    max = keyData[ii].count;
                }
            }
            
            return {
                max: max,
                data: data
            };
        };

        var pointerEventsCheck = function() {
            var element = document.createElement('x');
            element.style.cssText = 'pointer-events:auto';
            return element.style.pointerEvents === 'auto';
        }

        return {
            restrict: 'E',
            
            scope: {
                'layout': '=',
                'keydata': '=',
                'current': '=',
                'myindex': '@'
            },

            template: '<div id="{{id}}"><div id="{{hmId}}"></div><div id="{{infoId}}"></div><div style="font-weight:bold;">{{layout.keySet.label}}</div></div>',

            controller: function($scope) {
                var myInstance = instance++;
                $scope.id = 'kla-kbhm-container-'+myInstance;
                $scope.hmId = 'kla-kbhm-map-'+myInstance;
                $scope.infoId = 'kla-kbhm-info-'+myInstance;
                $scope.keyboard = null;
            },

            link: function(scope, element, attrs, controller) {
                $timeout(function() {
                    if ( $('#'+scope.id).length === 0 ) return;

                    $('#'+scope.infoId).css({
                        margin: '10px'
                    })
                    if (pointerEventsCheck() === true) {
                        $('#'+scope.infoId).html('Hover over a key to get its press count');  
                    } else {
                        $('#'+scope.infoId).html('');
                    }

                    scope.keyboard = new KB.Keyboard({
                        container: scope.hmId,
                        layout: scope.layout,
                        type: 'heatmap',
                        onKeyMouseOver: function(idx) {
                            if (pointerEventsCheck() === true) {
                                $('#'+scope.infoId).html('Pressed ' + scope.keydata[idx].count + ' times');
                                /*
                                $('#'+scope.hmId).css({
                                    'cursor': 'pointer'
                                });
                                */
                            }
                        },
                        onKeyboardMouseOut: function() {
                            $('#'+scope.infoId).html('Hover over a key to get its press count');  
                            $('#'+scope.hmId).css({
                                'cursor': 'default'
                            });
                        }
                    });

                    var config = {
                        element: document.getElementById(scope.hmId),
                        radius: 30,
                        opacity: 50
                    };

                    var heatmap = h337.create(config); 
                    heatmap.store.setDataSet(getHeatmapData(scope.keydata));
                }, 0);

                scope.$watch('current', function(newVal, oldVal) {
                    if (newVal === parseInt(scope.myindex, 10)) {
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
