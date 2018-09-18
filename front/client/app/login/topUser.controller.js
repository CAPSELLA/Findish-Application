/* C1 Controllers for Vehicles functionality */
(function () {
    'use strict';
    angular
        .module('app.login')
        .controller('topUserCtrl', topUserCtrl);

    topUserCtrl.$inject = ['$scope', '$state', '$cookies', 'loginService'];

    // C1.1 Controller for login.html
    function topUserCtrl($scope, $state, $cookies, loginService ) {

        $scope.$watch(loginService.checkUser, function (user) {

            if (user==false) {
                $scope.loggedIn = false;
            }else{
                $scope.loggedIn = true;
                $scope.user_name = user;
            }

        }, true);

        $scope.logOut = function () {
            $cookies.remove('user');
            $cookies.remove('SearchQuery');
            $cookies.remove('SearchOwnerQuery');
            $scope.loggedIn = false;
            $state.go('home');
        }

    }

})();