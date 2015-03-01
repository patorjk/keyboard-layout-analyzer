/*
	Controller for the main route
*/

'use strict';

var appControllers = appControllers || angular.module('kla.controllers', []);

appControllers.controller('MainCtrl', ['$scope', '$location', 'library', 'resultsGenerator', 'textPresets',
	function($scope, $location, library, resultsGenerator, textPresets) {

        $scope.data = {};
        $scope.data.text = library.get('input-text');
        $scope.data.textPreset = '';
        if ( typeof $scope.data.text === 'undefined' ) {
            $scope.data.text = 'This is some sample text to get you started.\n\nTo get the best results, paste some text that reflects what you type on a daily basis. Or load some pre-defined text from the dropdown option below.\n\nWhen you are done, click the "See Which Layout is Best" button.';
            library.set('input-text', $scope.data.text);
        }

		$scope.applyPreset = function() {
            if ($scope.data.textPreset === '') return;
			$scope.data.text = "Loading, one moment please...";
            textPresets.load( $scope.data.textPreset ).then(function(res) {
                $scope.data.text = res;
            });
		}

		$scope.generateOutput = function(txt) {
            if (txt === '') {
                alert('Please enter in some text to analyze.');
                return;
            }

            library.set('input-text', txt);
            $location.path('/load');
		}

        $scope.$watch('data.text', function(newVal, oldVal) {
            library.set('input-text', $scope.data.text);
        }, true);
	}
]);