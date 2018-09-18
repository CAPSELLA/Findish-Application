(function () {
    'use strict';
    angular
        .module('app.restaurant')
        .controller('restaurantOwnerCtrl', restaurantOwnerCtrl);

    restaurantOwnerCtrl.$inject = ['$scope', '$stateParams', '$filter', '$location', 'restaurantService', 'helperService'];

    function restaurantOwnerCtrl($scope, $stateParams, $filter, $location, restaurantService, helperService) {

        //Get restaurant id from url
        var rid = $stateParams.rId;

        // Configurations for Gallery
        $scope.conf = {
            thumbnails: true,
            thumbSize: 150,
            inline: false,
            bubbles: true,
            bubbleSize: 20,
            imgBubbles: true,
            bgClose: false,
            piracy: true,
            imgAnim: 'fadeup'
        };
        $scope.restaurantPictures = [];

        //Translate Filter
        var $translate = $filter('translate');

        //Get Restaurant (Athena)
        restaurantService.showRestaurantOwner(rid).then(
            function successCallback(res) {

                $scope.restaurant = res;
                $scope.restaurant.id = rid;
                $scope.mapLink = 'http://www.google.com/maps/place/' + $scope.restaurant.lat + ',' + $scope.restaurant.lng;

                $scope.restaurant.ambience = [];
                $scope.restaurant.price = [];
                $scope.restaurant.food = [];

                $scope.restaurant.ambience.push(res.ratings.ambience);
                $scope.restaurant.price.push(res.ratings.price);
                $scope.restaurant.food.push(res.ratings.food);

                createDiagramm();

                //Get Restaurant Local
                restaurantService.getRestaurant($stateParams.rId).then(
                    function successCallback(res) {
                        if (res.status === 200) {
                            $scope.hasOwner = true;
                            $scope.restaurant = res.data[0];
                        } else {
                            $scope.hasOwner = false;
                        }
                    },
                    function errorCallback(res) {
                        console.log('error');
                        console.log(res);
                    }
                );

            },
            function errorCallback(res) {
                console.log('error');
                console.log(res);
            });

        //Link to claim restaurant
        $scope.claimRest = function () {
            $location.url('/restaurant/edit/' + rid);
            var event = {
                type: 'RestClaimEdit',
                rid: rid
            };
            helperService.logEvent(event);
        };


        //Create Diagramm for Score
        function createDiagramm() {
            $scope.scoreDiagramm = {};
            $scope.scoreDiagramm.options = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y: 'bottom',
                    data: ['Restaraunt']
                },
                polar: [{
                    indicator: [{
                        text: $translate('SCORES.AMBIENCE'),
                        max: 5
                    },
                    {
                        text: $translate('SCORES.FOOD'),
                        max: 5
                    },
                    {
                        text: $translate('SCORES.PRICE'),
                        max: 5
                    }
                    ]
                }],
                calculable: true,
                series: [{
                    name: 'Restaraunt',
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data: [{
                        value: [$scope.restaurant.ratings.ambience, $scope.restaurant.ratings.ambience, $scope.restaurant.ratings.price],
                        name: 'Restaraunt'
                    }]
                }]
            };

        }

    }


})();
