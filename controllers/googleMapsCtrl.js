'use strict';
rwmtBook.controller('googleMapsCtrl',
    function googleMapsCtrl($scope) {
        $scope.ride = {
            fromAddress: "",
            toAddress: "",
            Lon: 27.588299,
            Lat: 47.156851,
            showError: function (status) {
//                toaster('error', "Error", status);
            }
        };

    });