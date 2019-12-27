/*
	Controller for the main route
*/

var appControllers = appControllers || angular.module('kla.controllers', []);

appControllers.controller('ConfigCtrl', ['$scope', '$http', '$timeout', '$log', 'keyboards',
	function($scope, $http, $timeout, $log, keyboards) {
	    $scope.submitter = {};
	    $scope.submitter.name = '';
	    $scope.submitter.url = '';
	    $scope.submitter.email = '';
	    $scope.submitter.submitting = false;
	    $scope.current = 0;
	    $scope.keyboards = keyboards;

	    $scope.switchLayout = function(evt, start, idx) {
	        $scope.current = idx;
	    };

	    $scope.showImportDialog = function() {
	        $('#kb-config-import-dialog .kb-config-dialog-txt').val("");
	        $('#kb-config-import-dialog').modal('show');
	    };

	    $scope.showExportDialog = function() {
	        $('#kb-config-export-dialog').modal('show');
	        $('#kb-config-export-dialog .kb-config-dialog-txt').val(JSON.stringify( keyboards.getKeySet($scope.current), undefined, 4 ));
	    };

	    $scope.selectAllExportText = function() {
	        $('#kb-config-export-dialog .kb-config-dialog-txt').select();
	    };

	    $scope.moreInfoLink = function(keySet) {
	    	if (typeof keySet.moreInfoUrl === 'undefined') {
	    		return 'None';
	    	}
	    	if (typeof keySet.moreInfoText === 'undefined') {
	    		return 'None';
	    	}
	    	if (keySet.moreInfoUrl === '' || keySet.moreInfoText === '') {
	    		return 'None';
	    	}
	    	return '<a href="'+keySet.moreInfoUrl+'">'+keySet.moreInfoText + '</a>';
	    }

	    $scope.importLayout = function() {
	        var res = keyboards.parseKeySet($('#kb-config-import-dialog .kb-config-dialog-txt').val());
	        if ( res.valid ) {	            
	            keyboards.setLayout( $scope.current, {
	            	keySet: $.extend(true, {}, res.keySet),
	            	keyMap: $.extend(true, {}, keyboards.getKeyMapFromKeyboardType(res.keySet.keyboardType))
	            });
	            $('#kb-config-import-dialog').modal('hide');
	        } else {
	            alert(res.reason);
	        }
	    };

	    $scope.loadLayout = function() {
	        var val = $('#kb-config-select-list').find('option:selected').attr('value').split(".");	        
            if (typeof KB.keySet[val[0]] !== 'undefined' && typeof KB.keySet[val[0]][val[1]] !== 'undefined') {
            	keyboards.setLayout( $scope.current, {
	            	keySet: $.extend(true, {}, KB.keySet[val[0]][val[1]]),
            		keyMap: $.extend(true, {}, KB.keyMap[val[0]].s683_225)
            	});
            } else {
		    	$http({
		    		method: 'POST',
		    		url: './api/get-layout.php',
		    		data: {
		    			type: val[0],
		    			label: val[1]
		    		}
		    	})
		    	.success(function(data, status, headers, config) {
	            	keyboards.setLayout( $scope.current, {
		            	keySet: data,
	            		keyMap: KB.keyMap[val[0]].s683_225
	            	});
		    	})
		    	.error(function(data, status, headers, config) {
		    		alert('Unexpected Error. Layout not loaded.');
		    	});
            }
	    };

	    $scope.submitDialog = function() {
	    	$('#kb-config-submit-dialog').modal('show');
	    };

	    $scope.submitLayout = function() {
	    	if ( $.trim($scope.submitter.name) === '' ) {
	    		alert('Please enter in a name.');
	    		return;
	    	}
	    	if ( $.trim($scope.submitter.email) === '' || $scope.submitter.email.indexOf('@') === -1) {
	    		alert('Please enter in an email address.');
	    		return;
	    	}

	    	$scope.submitter.submitting = true;

	    	$http({
	    		method: 'POST',
	    		url: './api/submit-layout.php',
	    		data: {
	    			name: $scope.submitter.name,
	    			url: $scope.submitter.url,
	    			email: $scope.submitter.email,
	    			layout: JSON.stringify( keyboards.getKeySet($scope.current), undefined, 4 )
	    		}
	    	})
	    	.success(function(data, status, headers, config) {
	    		$scope.submitter.submitting = false;
	    		$('#kb-config-submit-dialog').modal('hide');
	    	})
	    	.error(function(data, status, headers, config) {
	    		$scope.submitter.submitting = false;
	    		alert('Unexpected Error. Layout not submitted.');
	    		$('#kb-config-submit-dialog').modal('hide');
	    	});
	    }
	}
]);