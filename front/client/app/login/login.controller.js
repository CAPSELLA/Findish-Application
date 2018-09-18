/* C1 Controllers for Vehicles functionality */
(function () {
    'use strict';
    angular
        .module('app.login')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$state', '$window', 'loginService'];

    // C1.1 Controller for login.html
    function loginCtrl($scope, $state, $window, loginService) {
        $scope.done = false;

        //Include Facebook
        $window.fbAsyncInit = function () {

            FB.init({
                appId: '1978951449099025',
                cookie: true,
                xfbml: true,
                version: 'v2.11'
            });

            //Check if user is connected
            FB.Event.subscribe('auth.authResponseChange', function (res) {
                statusChangeCallback(res);
            });

        };

        //Set Fuctionality when logged in
        function statusChangeCallback(res) {
            if (res.status === 'connected') {
                loginService.loginUser(res.authResponse).then(
                    function (res) {
                        if (res == false) {
                            $state.go('profile');
                        }
                        if (res == 'profile') {
                            $state.go('search');
                        } else {
                            console.log(res);
                        }
                    }
                ).catch(function (error) {s
                    return error;
                });
            } else {
                console.log("Error Connecting");
                console.log(res);
            }
        };

        $scope.done = true;
    }

})();