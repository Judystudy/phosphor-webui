/**
 * Controller for SNMP
 *
 * @module app/configuration
 * @exports snmpController
 * @name snmpController
 */

window.angular && (function(angular) {
  'use strict';

  angular.module('app.configuration').controller('snmpController', [
    '$scope', '$window', 'APIUtils', 'dataService', '$location',
    '$anchorScroll', 'Constants', '$interval', '$q', '$timeout', '$interpolate',
    function(
        $scope, $window, APIUtils, dataService, $location, $anchorScroll,
        Constants, $interval, $q, $timeout, $interpolate) {			
        $scope.dataService = dataService;
		
        //Scroll to target anchor
		$scope.gotoAnchor = function() {
			$location.hash('upload');
			$anchorScroll();
		};

        $scope.firmwares = [];
        $scope.switchActiveVersion = '';
        //$scope.hostActiveVersion = '';
        $scope.display_error = false;
        $scope.activate_confirm = false;
        $scope.delete_image_id = '';
        $scope.delete_image_version = '';
        $scope.activate_image_id = '';
        $scope.activate_image_version = '';
        $scope.activate_image_type = '';
        $scope.priority_image_id = '';
        $scope.priority_image_version = '';
        $scope.priority_from = -1;
        $scope.priority_to = -1;
        $scope.confirm_priority = false;
        $scope.file_empty = true;
        $scope.uploading = false;
        $scope.upload_success = false;
        $scope.activate = {reboot: true};
        $scope.download_error_msg = '';
        $scope.download_success = false;

        var pollActivationTimer = undefined;
        var pollDownloadTimer = undefined;

        $scope.error = {modal_title: '', title: '', desc: '', type: 'warning'};

        $scope.activateImage = function(imageId, imageVersion, imageType) {
			$scope.activate_image_id = imageId;
			$scope.activate_image_version = imageVersion;
			$scope.activate_image_type = imageType;
			$scope.activate_confirm = true;
        };

        $scope.displayError = function(data) {
			$scope.error = data;
			$scope.display_error = true;
        };

        function waitForActive(imageId) {
			var deferred = $q.defer();
			var startTime = new Date();
			pollActivationTimer = $interval(function() {
            APIUtils.getActivation(imageId).then(
				function(state) {
					//@TODO: display an error message if image "Failed"
					if (((/\.Active$/).test(state.data)) ||
						((/\.Failed$/).test(state.data))) {
						$interval.cancel(pollActivationTimer);
						pollActivationTimer = undefined;
						deferred.resolve(state);
					}
				},
				function(error) {
					$interval.cancel(pollActivationTimer);
					pollActivationTimer = undefined;
					console.log(error);
					deferred.reject(error);
				});
				var now = new Date();
				if ((now.getTime() - startTime.getTime()) >=
				  Constants.TIMEOUT.ACTIVATION) {
					$interval.cancel(pollActivationTimer);
					pollActivationTimer = undefined;
					console.log('Time out activating image, ' + imageId);
					deferred.reject('Time out. Image did not activate in allotted time.');
				}
            }, Constants.POLL_INTERVALS.ACTIVATION);
			return deferred.promise;
        }

        $scope.activateConfirmed = function() {
			APIUtils.activateImage($scope.activate_image_id)
            .then(
                function(state) {  ///activate sucdess
                    $scope.loadFirmwares();
                    return state;
                },
                function(error) {  ///activate fail
                    $scope.displayError({
						modal_title: 'Error during activation call',
						title: 'Error during activation call',
						desc: JSON.stringify(error.data),
						type: 'Error'
                    });
                })
            .then(function(activationState) { ///wait For activate
                waitForActive($scope.activate_image_id)
                .then(
                    function(state) {
                        $scope.loadFirmwares();
                    },
                    function(error) {
                        $scope.displayError({
                            modal_title: 'Error during image activation',
                            title: 'Error during image activation',
                            desc: JSON.stringify(error.data),
                            type: 'Error'
                        });
                    })
                .then(function(state) {
                    if ($scope.activate.reboot &&
                       ($scope.activate_image_type == 'Switch')) {
                        $timeout(function() {
                        APIUtils.bmcReboot(
                            function(response) {},
                            function(error) {
                              $scope.displayError({
                                modal_title: 'Error during Switch reboot',
                                title: 'Error during Switch reboot',
                                desc: JSON.stringify(error.data),
                                type: 'Error'
                              });
                            });
                      }, 10000);
                    }
                });
            });
			$scope.activate_confirm = false;
        };
     
      
		$scope.upload = function() {
			if ($scope.file) {
				$scope.uploading = true;
				$scope.upload_success = false;
				APIUtils.uploadImage($scope.file)
				.then(
					function(response) {
						$scope.file = '';
						$scope.uploading = false;
						$scope.upload_success = true;
						$scope.loadFirmwares();
						$scope.loadSwitchActiveVersion();
					},
					function(error) {
						$scope.uploading = false;
						console.log(error);
						$scope.displayError({
						modal_title: 'Error during image upload',
						title: 'Error during image upload',
						desc: error,
						type: 'Error'
					});
				});
			}
		};

        function waitForDownload() {
			var deferred = $q.defer();
			var startTime = new Date();
			pollDownloadTimer = $interval(function() {
				var now = new Date();
				if ((now.getTime() - startTime.getTime()) >=
					Constants.TIMEOUT.DOWNLOAD_IMAGE) {
					$interval.cancel(pollDownloadTimer);
					pollDownloadTimer = undefined;
					deferred.reject(
					new Error(Constants.MESSAGES.POLL.DOWNLOAD_IMAGE_TIMEOUT));
				}

				APIUtils.getFirmwares().then(
					function(response) {
						if (response.data.length === $scope.firmwares.length + 1) {
							$interval.cancel(pollDownloadTimer);
							pollDownloadTimer = undefined;
							deferred.resolve(response.data);
						}
					},
					function(error) {
						$interval.cancel(pollDownloadTimer);
						pollDownloadTimer = undefined;
						deferred.reject(error);
					});
			}, Constants.POLL_INTERVALS.DOWNLOAD_IMAGE);
			
			return deferred.promise;
        }

        $scope.download = function() {
			$scope.download_success = false;
			$scope.download_error_msg = '';
			if (!$scope.download_host || !$scope.download_filename) {
				$scope.download_error_msg = 'Field is required!';
				return false;
			}
			$scope.downloading = true;
			APIUtils.getFirmwares()
			.then(function(response) {
				$scope.firmwares = response.data;
			})
			.then(function() {
				return APIUtils
					.downloadImage($scope.download_host, $scope.download_filename)
					.then(function(downloadStatus) {
					return downloadStatus;
				});
			})
			.then(function(downloadStatus) {
			  return waitForDownload();
			})
			.then(
				function(newFirmwareList) {
				    $scope.download_host = '';
				    $scope.download_filename = '';
				    $scope.downloading = false;
				    $scope.download_success = true;
				    $scope.loadFirmwares();
				},
				function(error) {
				    console.log(error);
				    $scope.displayError({
						modal_title: 'Error during downloading Image',
						title: 'Error during downloading Image',
						desc: error,
						type: 'Error'
				    });
				    $scope.downloading = false;
				});
        };

	    $scope.changePriority = function(imageId, imageVersion, from, to) {
			$scope.priority_image_id = imageId;
			$scope.priority_image_version = imageVersion;
			$scope.priority_from = from;
			$scope.priority_to = to;
			$scope.confirm_priority = true;
	    };

        $scope.confirmChangePriority = function() {
			$scope.loading = true;
			APIUtils.changePriority($scope.priority_image_id, $scope.priority_to)
            .then(function(response) {
                $scope.loading = false;
                if (response.status == 'error') {
					$scope.displayError({
					modal_title: response.data.description,
					title: response.data.description,
                  desc: response.data.exception,
                  type: 'Error'
                });
              } else {
                $scope.loadFirmwares();
              }
            });
			$scope.confirm_priority = false;
        };
	  
        $scope.deleteImage = function(imageId, imageVersion) {
			$scope.delete_image_id = imageId;
			$scope.delete_image_version = imageVersion;
			$scope.confirm_delete = true;
		};
		
        $scope.confirmDeleteImage = function() {
			$scope.loading = true;
			APIUtils.deleteImage($scope.delete_image_id).then(function(response) {
				$scope.loading = false;
				if (response.status == 'error') {
					$scope.displayError({
						modal_title: response.data.description,
						title: response.data.description,
						desc: response.data.exception,
						type: 'Error'
					});
				} else {
					$scope.loadFirmwares();
				}
			});
			$scope.confirm_delete = false;
		};
			
		$scope.fileNameChanged = function() {
			$scope.file_empty = false;
		};

        $scope.filters = {bmc: {imageType: 'BMC'}, Switch: {imageType: 'Host'}};

        $scope.loadFirmwares = function() {
			APIUtils.getFirmwares().then(function(result) {
				$scope.firmwares = result.data;
				//$scope.switchActiveVersion = result.hostActiveVersion;
            });
        };
		
		
		$scope.loadSwitchActiveVersion = function() {
			APIUtils.getSwitchActiveVersion(function(data, originalData) {
				//console.log(data);
				/*var date = data%100000000;
				var front = Math.floor(data/100000000);
				var temp = front/10;
				var ver = parseFloat(temp).toFixed(1);
				var version = 'v' + ver.toString() + '-' + date.toString();
				$scope.switchActiveVersion = version;*/
				$scope.toBeActiveVer = 'v' + (data%100).toString();
				$scope.switchActiveVer = 'v' + parseInt(data/100).toString();
			});
        };
		
		$scope.loadSwitchUpdateStatus = function(){
			APIUtils.getSwitchUpdateStatus().then(function(result){
				console.log(result);
				$scope.switchUpdateStatus = result;
			});
		};
		
		$scope.loadSwitchActivatedStatus = function(){
			APIUtils.getSwitchActivatedStatus().then(function(result){
				console.log(result);
				$scope.switchActivatedStatus = result;
			});
		};
		
		$scope.updateImage = function(imageId, imageVersion, imageType) {
			//$scope.activate_image_id = imageId;
			$scope.activate_image_version = imageVersion;
			$scope.activate_image_type = imageType;
			//$scope.activate_confirm = true;
			APIUtils.updateImage(1)
            .then(
                function(state) {  ///update success
                    $scope.loadFirmwares();
					$scope.loadSwitchActiveVersion();
					//$scope.loadSwitchUpdateStatus();
                    return state;
                },
                function(error) {  ///update fail
                    $scope.displayError({
						modal_title: 'Error during update call',
						title: 'Error during update call',
						desc: JSON.stringify(error.data),
						type: 'Error'
                    });
                })
        };
			APIUtils.updateImage($scope.activate_image_id)
            .then(
                function(state) {  ///update success
                    $scope.loadFirmwares();
					$scope.loadSwitchActiveVersion();
					$scope.loadSwitchUpdateStatus();
                    return state;
                },
                function(error) {  ///update fail
                    $scope.displayError({
						modal_title: 'Error during update call',
						title: 'Error during update call',
						desc: JSON.stringify(error.data),
						type: 'Error'
                    });
                })
            
			//$scope.activate_confirm = false;
        };
		
		$scope.runImage = function(imageId, imageVersion, imageType) {
			$scope.activate_image_id = imageId;
			$scope.activate_image_version = imageVersion;
			$scope.activate_image_type = imageType;
			$scope.activate_confirm = true;
			
        };

		$scope.runConfirmed = function() {
			APIUtils.runImage(1)
            .then(
                function(state) {  ///run success
                    $scope.loadFirmwares();
					$scope.loadSwitchActiveVersion();
					//$scope.loadSwitchActivatedStatus();
                    return state;
                },
                function(error) {  ///run fail
                    $scope.displayError({
						modal_title: 'Error during activation call',
						title: 'Error during activation call',
						desc: JSON.stringify(error.data),
						type: 'Error'
                    });
                })
            
			$scope.activate_confirm = false;
        };
				
       $scope.loadFirmwares();
	   $scope.loadSwitchActiveVersion();
	   //$scope.loadSwitchUpdateStatus();
	   //$scope.loadSwitchActivatedStatus();
    }
  ]);
})(angular);
