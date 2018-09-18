(function () {
    'use strict';
    angular
        .module('app.login')
        .controller('loginOwnerCtrl', loginOwnerCtrl);

    loginOwnerCtrl.$inject = ['$scope', '$state', '$window', 'loginService'];

    // Controller for loginOwner.html
    function loginOwnerCtrl($scope, $state, $window, loginService) {
        $scope.loginOwnerSubmit = function () {
            $scope.error = null;
            loginService.loginOwner($scope.owner).then(
                function successCallback(res) {
                    if (res == 'logged') {
                        $state.go('searchOwner');
                    } else {
                        $scope.error = res;
                    }
                },
                function errorCallback(res) {
                    $scope.error = res;
                }
            );
        };
    }
})();