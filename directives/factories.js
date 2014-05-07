/**
 * Created by Bogdan Cochior on 24/04/14.
 */


rwmtBook.factory('getRidesFactory', function ($http) {
    return {
        getRides: function (callback) {
            $http.get('http://localhost.rwmt.com/app_dev.php/api/v1/rides').success(callback);
        }
    };
});

rwmtBook.factory('getUserDetails', function ($http) {
    return {
        getUser: function (callback) {
            $http.get('http://localhost.rwmt.com/app_dev.php/api/v1/:id', {params: { id: userId}}).success(callback);
        }
    };
});
