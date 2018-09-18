(function () {
    'use strict';

    angular.module('app')
        .controller('AppCtrl', AppCtrl); // overall control
    
  AppCtrl.$inject = ['$scope', '$rootScope', '$state', '$document', 'appConfig'];

    function AppCtrl($scope, $rootScope, $state, $document, appConfig) {

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.main = appConfig.main;
        $scope.color = appConfig.color;
        // $rootScope.basePath = API ADRESS ;
        $rootScope.basePath = 'http://localhost:8080';

        $scope.$watch('main', function(newVal, oldVal) {
            
            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
                $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
                if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                    $scope.main.fixedHeader = true;
                    $scope.main.fixedSidebar = true;
                }
                if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                    $scope.main.fixedHeader = false;
                    $scope.main.fixedSidebar = false;
                }
            }
            if (newVal.fixedSidebar === true) {
                $scope.main.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
                $scope.main.fixedSidebar = false;
            }
        }, true);


        $rootScope.$on('$stateChangeSuccess', function () {
            $document.scrollTo(0, 0);
        });
    }

})(); 