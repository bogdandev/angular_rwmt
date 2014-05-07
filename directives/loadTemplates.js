/**
 * Created by Bogdan Cochior on 06/03/14.
 */

rwmtBook.directive('ridesList', function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/ridesList.html',
        replace: true
    };
});
rwmtBook.directive('search', function() {
    return {
        restrict: 'A',
        templateUrl: 'templates/search.html',
        replace: true
    };
});

rwmtBook.directive('searchs', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            user: '='
        },
        require: '^gmap',
        templateUrl: "templates/searchs.html",
        link: function (scope, iElement, iAttrs, enterUserCtrl) {
            scope.delete = function(user) {
                enterUserCtrl.delete(user)
            }
        }
    };
})