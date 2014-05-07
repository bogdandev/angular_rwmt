"use strict";
var rwmtBook = angular.module('rwmtBook',
    ['googleMaps', 'ngAutocomplete', 'ngRoute', 'ngAnimate', 'ngSanitize', 'toaster', 'uiSlider', 'ngCookies', 'ui.bootstrap']);

//Route Configuration
rwmtBook.config(function ($routeProvider) {
    $routeProvider

        .when('/search', {
            templateUrl: 'templates/searchMap.html',
            controller: 'googleMapsCtrl'
        })
        .when('/newride', {
            templateUrl: 'templates/newRideMap.html',
            controller: 'googleMapsCtrl'
        })
        .when('/register', {
            templateUrl: 'templates/register.html',
            controller: 'registerCtrl'
        })
        .when('/login', {
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })
        .when('/registerConfirmation', {
            templateUrl: 'templates/registerConfirmation.html',
            controller: 'registerCtrl'
        })
        .when('/profile', {
            templateUrl: 'templates/profile.html',
            controller: 'profileCtrl'
        })
});

rwmtBook.controller('setAPIheader', function(authentication, config){
    authentication.setTenantAPIkey(config.apiKey);
    });

rwmtBook.constant('config', {
//    'apiUrl': 'http://api.ridewithme.today/app_dev.php/api/v1',
    'apiUrl': 'http://localhost.rwmt.com/app_dev.php/api/v1',
    'hostUrl': 'http://localhost:7000',
    'version': 1.0,
    'apiKey' : 'P182dla1aq8AvIELjFz9'
})