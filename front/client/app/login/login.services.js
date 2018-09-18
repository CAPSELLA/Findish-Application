/* S1. Service to handle Vehicles */
(function () {
    'use strict';
    angular
        .module('app.login')
        .service('loginService', loginService);

    loginService.$inject = ['$http', '$cookies','$rootScope'];

    function loginService($http, $cookies,$rootScope) {

        // S1.1 Login User
        var loginUser = function (authResponse) {

            //Check if profile exists
            return $http.get($rootScope.basePath+'/apii/users/profile/' + authResponse.userID).then(function (res) {
                if (res.data.profile) {
                    //Create cookie for user
                    var expires = new Date();
                    expires.setTime(expires.getTime() + (30 * 60 * 1000));
                    var user =  {
                        id: res.data.userId,
                        role: 'client',
                        name: res.data.displayName
                    }
                    $cookies.putObject(
                        'user',
                        user,
                        { expires: expires }
                    );
                    return 'profile';
                } else {
                    $cookies.putObject(
                        'newuser',
                        authResponse
                    );
                    return false;
                }
            }).catch(function (error) {
                return error;
            });


        };

        // 1.2 Login Owner
        var loginOwner = function (owner) {
            var req = {
                method: 'POST',
                url: $rootScope.basePath+'/apii/login/owner',
                data: owner
            }

            return $http(req).then(
                function successCallback(res) {
                    console.log(res);
                    //Create cookie for user
                    var expires = new Date();
                    expires.setTime(expires.getTime() + (30 * 60 * 1000));
                    var user = {
                        id: res.data.ownerId,
                        role: 'owner',
                        name: res.data.name+' '+res.data.surname
                    }
                    $cookies.putObject(
                        'user', user,
                        { expires: expires }
                    );
                    return 'logged';
                }, function errorCallback(res) {
                    console.log(res);
                    return res.data;
                }
            );

        };


        var checkUser = function(){
            var current_user = $cookies.getObject('user');
            if (current_user) {
                return current_user.name;
            } else {
                return false;
            }
        }

        return {
            loginUser: loginUser,
            loginOwner: loginOwner,
            checkUser: checkUser
        };

    };

})();



