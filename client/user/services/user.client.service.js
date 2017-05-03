angular.module('user').factory('User', ['$resource', function ($resource) {
    return $resource('http://localhost:3000/user/:action', {
        action: ''
    }, {
        signin: {
            method: 'POST',
            params: {action: 'signin'}
        },
        signout: {
            method: 'GET',
            params: {action: 'signout'}
        },
        signup: {
            method: 'POST',
            params: {action: 'signup'}
        }
    })

}]);