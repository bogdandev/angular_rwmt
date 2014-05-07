/**
 * Created by Bogdan Cochior on 24/04/14.
 */
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
        template: '<img alt="{{ name }}" height="100"  width="100" src="https://secure.gravatar.com/avatar/{{ emailHash }}.jpg?s={{ width }}&d={{ defaultImage }}">'
    };
});