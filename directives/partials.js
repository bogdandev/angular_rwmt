/**
 * Created by Bogdan Cochior on 07/04/14.
 */

rwmtBook.directive('profileDetails', function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/partials/profileDetails.html',
        replace: true
    };
});
rwmtBook.directive('vehicleDetails', function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/partials/vehicleDetails.html',
        replace: true
    };
});
rwmtBook.directive('otherDetails', function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/partials/otherDetails.html',
        replace: true
    };
});

rwmtBook.directive("profile", function ($window, config) {
    return function (scope, element) {
        element.bind("click", function () {
            $window.location = config.hostUrl + "/#/profile";
        });
    };
});

rwmtBook.directive('gravatar', function() {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            name: '@',
            height: '@',
            width: '@',
            emailHash: '@'
        },
        link: function(scope, el, attr) {
            scope.defaultImage = 'http://www.udel.edu/oiss/about/images/man-placeholder.jpg';
        },
        template: '<img class="img-circle" alt="{{ name }}" height="100"  width="100" src="https://secure.gravatar.com/avatar/{{ emailHash }}.jpg?s=100&d={{ defaultImage }}">'
    };
});