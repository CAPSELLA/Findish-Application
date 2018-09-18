(function () {
    'use strict';
    angular
        .module('app.restaurant')
        .controller('restaurantEditCtrl', restaurantEditCtrl);

    restaurantEditCtrl.$inject = ['$scope', '$stateParams', '$timeout', '$cookies', 'restaurantService', 'helperService', 'filepickerService', '$window'];

    function restaurantEditCtrl($scope, $stateParams, $timeout, $cookies, restaurantService, helperService, filepickerService, $window) {

        //Get restaurant id from url
        $scope.restaurantid = $stateParams.rId;

        $scope.updateMssg = " ";

        //Upload Images Configuration
        $scope.files = JSON.parse($window.localStorage.getItem('files') || '[]');
        $scope.pickFile = pickFile;
        $scope.restaurantImg = [];
        $scope.Img = [];

        $scope.conf = {
            thumbnails: true,
            thumbSize: 80,
            inline: false,
            bubbles: true,
            bubbleSize: 20,
            imgBubbles: true,
            bgClose: false,
            piracy: true,
            imgAnim: 'fadeup'
        };

        function pickFile() {
            filepickerService.pick({
                mimetype: 'image/*'
            },
                onSuccess
            );
        }
  
        $scope.getFileArtistPhoto = function (info) {
            $scope.Img = info;

            for (var i = 0; i < $scope.Img.length; i++) {
                var id = Math.floor(Math.random() * 9999999999) + i;
                $scope.restaurantImg = $scope.restaurantImg.concat(
                    {
                        id: id,
                        url: $scope.Img[i].url,
                        deletable: true
                    }
                );
            }
        };


        $scope.delete = function (img, cb) {
            cb();
        };

        //Get Restaurant Data (Local)
        restaurantService.getRestaurant($stateParams.rId).then(
            function successCallback(res) {
                if (res.status == 200) {
                    $scope.hasOwner = true;
                    $scope.restaurant = res.data[0];
                    $scope.restaurantImg = $scope.restaurant.pictures;
                } else {
                    $scope.hasOwner = false;
                    //Get Restaurant (Athena)
                    restaurantService.showRestaurantOwner($stateParams.rId).then(
                        function successCallback(res) {
                            $scope.restaurant = res;
                        },
                        function errorCallback(res) {
                            console.log('error');
                            console.log(res);
                        }
                    );
                }
            },
            function errorCallback(res) {
                console.log('error');
                console.log(res);
            });


        //Get Cuisine
        helperService.getCuisines().then(
            function successCallback(res) {
                $scope.cuisines = res;
            }
        );

        //Post Restaurannt
        $scope.postRestaurant = function () {
            $scope.restaurant.pictures = $scope.restaurantImg;
            $scope.updateMssg = " ";
            restaurantService.postRestaurant($scope.restaurant).then(
                function successCallback(res) {
                    $scope.hasOwner = true;
                    $scope.updateMssg = "The restaurant has been claimed";
                    $scope.restaurant.id =  $stateParams.rId;
                }, function errorCallback(res) {
                    $scope.updateMssg = "There has been an error updating the restaurant";
                    console.log('error');
                    console.log(res);
                }
            );
        };

        //Update Restaurant
        $scope.updateRestaurant = function () {
            $scope.restaurant.pictures = $scope.restaurantImg;
            $scope.updateMssg = " ";
            restaurantService.putRestaurant($scope.restaurant).then(
                function successCallback(res) {
                    $scope.updateMssg = "The restaurant has been updated";
                    $scope.restaurant.id =  $stateParams.rId;
                }, function errorCallback(res) {
                    $scope.updateMssg = "There has been an error updating the restaurant";
                    console.log('error');
                    console.log(res);
                }
            );
        };

    }


})();
