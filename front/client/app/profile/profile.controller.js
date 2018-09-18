(function () {
    'use strict';
    angular
        .module('app.profile')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['$scope', '$state', '$window', 'profileService', 'helperService'];

    // C1.1 Controller for profile.html
    function profileCtrl($scope, $state, $window, profileService, helperService) {

        helperService.getCuisines().then(
            function successCallback(res){
                $scope.cuisines = res;
            }
        );

        $scope.user = {};
        $scope.user.cuisine = [];

        $scope.toggleSelectCuisine = function (c) {
            var idx = $scope.user.cuisine.indexOf(c);
            if (idx > -1) {
                $scope.user.cuisine.splice(idx, 1);
            }
            else {
                $scope.user.cuisine.push(c);
            }
        }

        $scope.submitProfile = function () {
            $scope.error = "";
            profileService.AddProfile($scope.user).then(
                function successCallback(res) {
                    $state.go('search');
                }, function errorCallback(res) {
                    $scope.error = res.data;
                }
            );
        }

    }

})();