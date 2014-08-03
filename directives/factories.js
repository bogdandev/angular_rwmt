/**
 * Created by Bogdan Cochior on 24/04/14.
 */


rwmtBook.factory('getRidesFactory', function ($http, config) {
    return {
        getRides: function (callback) {
            $http.get(config.apiUrl + '/rides').success(callback);
        }
    };
});

rwmtBook.factory('getUserDetails', function ($http, config) {
    return {
        getUser: function (callback) {
            $http.get(config.apiUrl + '/:id', {params: { id: userId}}).success(callback);
        }
    };
});
