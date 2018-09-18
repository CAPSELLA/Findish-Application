(function () {
      'use strict';
    angular
        .module('app.profile')
        .service('profileService', profileService);

    profileService.$inject = ['$http', '$cookies','$rootScope'];

    function profileService($http, $cookies,$rootScope) {

        // Add Profile
        var AddProfile = function (p) {

            var profile = angular.copy(p);

            //Get Social Id from Cookie (disabled for demo)
            var userCookie = $cookies.getObject('newuser');
            //profile.socialprofile = userCookie.userID;
            profile.socialprofile = 123;

            var req = {
                method: 'POST',
                url: $rootScope.basePath+'/apii/users/',
                data: profile
            };

            return $http(req).then(
                function successCallback(res) {
                    //Create cookie for user
                    var expires = new Date();
                    expires.setTime(expires.getTime() + (30 * 60 * 1000));
                    var user = {
                        id: res.data._id,
                        role: 'client',
                        name: res.data.displayName
                    };
                    $cookies.putObject(
                        'user',
                        user,
                        { expires: expires }
                    );
                    //Remove new user cookie
                    $cookies.remove('newuser');
                    return res;
                }, function errorCallback(res) {
                    console.log("error");
                    console.log(res);
                    return res;
                }
            );

        };

        // Add Profile
        var AddProfileOwner = function (p) {

            var profile = angular.copy(p);

            var req = {
                method: 'POST',
                url: $rootScope.basePath+'/apii/owners/',
                data: profile
            };

            return $http(req).then(
                function successCallback(res) {
                    //Create cookie for user
                    var expires = new Date();
                    expires.setTime(expires.getTime() + (30 * 60 * 1000));
                    $cookies.putObject(
                        'user',
                        {
                            id: res.data._id,
                            role: 'owner',
                            name: res.data.name+' '+res.data.surname
                        },
                        { expires: expires }
                    );
                    return res;
                }, function errorCallback(res) {
                    console.log("error");
                    console.log(res);
                    return res;
                }
            );

        };

        return {
            AddProfile: AddProfile,
            AddProfileOwner: AddProfileOwner
        };

    }

})();



