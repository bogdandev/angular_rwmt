/**
 * Created by Bogdan Cochior on 03/03/14.
 */

'use strict';

rwmtBook.controller('processForm',
    function ($scope, $http, config, $modal, $cookieStore) {
        $scope.isLogged = $cookieStore.get('isLogged');

        $scope.publishModal = function () {

            if (!$scope.isLogged){
                alert('Please login first!');
            }else{
                var modalInstance = $modal.open({
                    templateUrl: 'templates/partials/publishRide.html',
                    controller: publishRideCtrl,
                    resolve: {
                        model: function () {
                            return true;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                }, function () {

                });
            }

        };

        var publishRideCtrl = function ($scope, $modalInstance, model) {

            $scope.model = model;

            $scope.ok = function () {
//                $modalInstance.close($scope.model);
            };

            $scope.cancel = function () {
//                $modalInstance.dismiss('cancel');
            };
        };

        $scope.processRide = function() {
            $http({
                method: 'POST',
                url: config.apiUrl +'/rides',
                data: $.param(
                    {'fromAddress': $scope.ride.fromAddress,
                        'toAddress': $scope.ride.toAddress,
                        'fromLat':'',
                        'toLat': '',
                        'fromLng': '',
                        'toLng': '',
                        'totalSeats':'',
                        'pickupDateTime':'',
                        'isRecursive': '',
                        'recursiveDays': ''
                    }), // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept':'application/json' }  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function( ) {
                    toaster.pop('success', "Add a ride", 'Succesfuly added');
                    console.log('succesfuly added');
                });
        };
    });


rwmtBook.controller('getRidesList', function ($scope, $http, getRidesFactory) {
    var list = this;
    getRidesFactory.getRides(function (results) {
        list.rides = results;
    });
});




//
//rwmtBook.factory('postBookingFactory', function($http){
//    return {
//        getSessions: function() {
//            return $http.post('',
//                {
//                type : 'getSource',
//                ID    : 'TP001'
//            });
//        }
//    };
//});
//
//rwmtBook.controller('processForm',function($scope, postBookingFactory){
//    $scope.ride = [];
//
//    var handleSuccess = function(data, status) {
//        $scope.ride = data;
//        console.log($scope.ride);
//    };
//    postBookingFactory.getSessions().success(handleSuccess);
//});
