/*
	Controller for the main route
*/

var appControllers = appControllers || angular.module('kla.controllers', []);

appControllers.controller('ResultsCtrl', ['$scope', '$location', '$http', '$log', 'library',
	function($scope, $location, $http, $log, library ) {

        $scope.results = library.get();
        $scope.settings = {};
        $scope.settings.cfuIgnoreDups = true;
        $scope.settings.chuIgnoreDups = true;
        $scope.currentHeatmap = 0;
        $scope.share = {};
        $scope.share.showSection = true;
        $scope.share.generatingUrl = false;
        $scope.share.url = '';
        $scope.share.returnedUrl = '';

        // If no result data exist, redirect to the main page
        if ( typeof $scope.results['distance'] === 'undefined') {
            $location.path('/main');
            return;
        }

        if ( $scope.results['input-text'].length > 500000 ) {
            $scope.share.showSection = false;
        }

        function getShareUrl(textKey) {
            return window.location.protocol + '//' + window.location.host + window.location.pathname + '#/load/'+textKey;
        }

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        $scope.getUrlToShare = function() {
            if ($scope.share.returnedUrl !== '') {
                $scope.share.url = $scope.share.returnedUrl;
                return;
            };
            if ($scope.share.generatingUrl === true) return;
            $scope.share.generatingUrl = true;
            $scope.share.url = 'One moment please...';

            var layouts = $.extend(true, [], $scope.results.layouts);
            layouts.pop(); // remove personalized layout

            $http({
                method: 'POST',
                url: './api/save-results.php',
                data: {
                    inputText: $scope.results.inputText,
                    layoutText: JSON.stringify(layouts)
                }
            })
            .success(function(data, status, headers, config) {
                $log.debug('success in saving data');
                $log.debug(data);
                $scope.share.url = getShareUrl(data.textKey);
                $scope.share.returnedUrl = $scope.share.url;
                $scope.share.generatingUrl = false;
            })
            .error(function(data, status, headers, config) {
                $log.debug('failed to save data');
                $log.debug(data);
                $scope.share.url = 'Unable to save data, try again in an hour or two.';
                $scope.share.generatingUrl = false;
            });
        };

        $scope.getKeyLabel = function(primary, shift, altGr, shiftAltGr) {
            var ii, ret = '', newVal, keyCode;
            for(ii = 0; ii < 4; ii++) {
                keyCode = arguments[ii];
                if (isNumber(keyCode)) {
                    newVal = (typeof KB.Key.labels[keyCode] !== 'undefined') ? KB.Key.labels[keyCode] : String.fromCharCode(keyCode);
                    ret = (ii === 0) ? newVal : ret + ' ' + newVal;
                }
            }
            return ret;
        }

        $scope.switchHeatmap = function(evt, start, idx) {
            $scope.currentHeatmap = idx;
        };

        var processInputData = function(tab) {
            var lookup = {}, ii;
            lookup['distance'] = ['distance'];
            lookup['fingerUsage'] = ['fingerUsage'];
            lookup['rowUsage'] = ['rowUsage'];
            lookup['miscellaneous'] = ['consecFingerPress', 'consecHandPress', 'modifierUse']
            lookup['consecFingerPress'] = ['consecFingerPress']
            lookup['consecHandPress'] = ['consecHandPress']
            lookup['modifierUse'] = ['modifierUse']

            if ( !lookup[tab] ) return;

            for (ii = 0; ii < lookup[tab].length; ii++) {
                    var prop = lookup[tab][ii];
                    $scope.results[prop].seriesData = $scope.results[prop].displayFilter(   $scope.results[prop].displayType, 
                                                                                            $scope.results[prop].units, 
                                                                                            $scope.results[prop].rawSeriesData,
                                                                                            $scope.results[prop].displayData );
                    $scope.results[prop].dirty = Date.now();
            }
        };

        $scope.returnToInput = function() {
            $location.path('/main');
        };

        $scope.tabSwitch = function(evt, tab) {
            evt.preventDefault();
            $(evt.currentTarget).tab('show');
            $log.debug('tab switch!' + tab);
            processInputData(tab);
        };

        /*
            Init and watches
        */
    
        // update share url
        if ( $scope.results.textKey ) {
            $scope.share.url = getShareUrl($scope.results.textKey);
            $scope.share.returnedUrl = $scope.share.url;
            library.set('textKey', null); // for future uses
        }

        var seriesTypes = ['distance', 'fingerUsage', 'rowUsage', 'consecFingerPress', 'consecHandPress', 'modifierUse']
        var ii = 0;
        for (ii = 0; ii < seriesTypes.length; ii++) {
            var prop = seriesTypes[ii];
            $scope.$watch('results["'+prop+'"].units + results["'+prop+'"].displayType', (function() {
                var myProp = prop;
                return function(newVal, oldVal) {
                    processInputData(myProp);
                };
            })(), true);

            $scope.$watch('results["'+prop+'"].rawSeriesData', (function() {
                var myProp = prop;
                return function(newVal, oldVal) {
                    processInputData(myProp);
                };
            })(), true);
        }

        $scope.$watch('settings.cfuIgnoreDups', function(newVal, oldVal, scope) {
            scope.results.consecFingerPress.displayType = (newVal === true) ? 'nodups' : 'dups';
        });

        $scope.$watch('settings.chuIgnoreDups', function(newVal, oldVal, scope) {
            scope.results.consecHandPress.displayType = (newVal === true) ? 'nodups' : 'dups';
        });
	}
]);