(function () {
    'use strict';
    angular
        .module('app.profile')
        .controller('profileOwnerCtrl', profileOwnerCtrl);

    profileOwnerCtrl.$inject = ['$scope', '$state', '$window', 'profileService'];

    //Controller for profileOwner.html
    function profileOwnerCtrl($scope, $state, $window, profileService) {

        $scope.submitProfile = function () {
            $scope.error = "";
            profileService.AddProfileOwner($scope.owner).then(
                function successCallback(res) {
                    $state.go('searchOwner');
                }, function errorCallback(res) {
                    $scope.error = res.data;
                }
            );
        };

    }

})();