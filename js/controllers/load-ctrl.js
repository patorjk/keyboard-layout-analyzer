/*
	Controller for the main route
*/

'use strict';

var appControllers = appControllers || angular.module('kla.controllers', []);

appControllers.controller('LoadCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', '$log', 'keyboards', 'library', 'resultsGenerator',
	function($scope, $routeParams, $location, $http, $timeout, $log, keyboards, library, resultsGenerator) {

        var analyzeData = function(txt) {
            try {
                if (resultsGenerator.go(txt)) {
                    $location.path('/results');
                }
            } catch(err) {
                alert( err.message );
                $location.path('/main');
            }
        };

        $scope.$on('$viewContentLoaded', function() {

            $timeout(function() {
                var textKey = $routeParams.textKey;
                if (typeof textKey === 'undefined') {
                    analyzeData( library.get('input-text') );
                } else {
                    $http({
                        method: 'POST',
                        url: './api/load-results.php',
                        data: {
                            textKey: $routeParams.textKey
                        }
                    })
                    .success(function(data, status, headers, config) {
                        $log.debug('success!!!');
                        $log.debug(data);

                        var layouts = JSON.parse(data.layoutText);
                        var ii;
                        for (ii = 0; ii < layouts.length; ii++) {
                            var res = keyboards.parseKeySet( JSON.stringify(layouts[ii].keySet) );
                            if ( res.valid ) {              
                                keyboards.setLayout( ii, {
                                    keySet: $.extend(true, {}, res.keySet),
                                    keyMap: $.extend(true, {}, keyboards.getKeyMapFromKeyboardType(res.keySet.keyboardType))
                                });
                            } else {
                                $log.debug('unable to load layout');
                                $log.debug(res);
                            }
                        }

                        library.set('input-text', data.inputText);
                        library.set('textKey', textKey)
                        analyzeData( library.get('input-text') );

                    })
                    .error(function(data, status, headers, config) {
                        $location.path('/main');
                    });
                }
            }, 500);


        });
	}
]);