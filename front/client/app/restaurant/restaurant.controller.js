(function () {
    'use strict';
    angular
        .module('app.restaurant')
        .controller('restaurantCtrl', restaurantCtrl);

    restaurantCtrl.$inject = ['$scope', '$stateParams', '$filter', '$cookies', 'restaurantService'];

    function restaurantCtrl($scope, $stateParams, $filter, $cookies, restaurantService) {

        //Translate Filter
        var $translate = $filter('translate');

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

        //Get search loc
        $scope.loc = {};
        var searchCookie = $cookies.getObject('SearchQuery');
        if (searchCookie) {
            //Initialize Map from Cookie
            $scope.loc.lat = searchCookie.lat;
            $scope.loc.lng = searchCookie.lng;
            $scope.dish = searchCookie.menu;
        } else {
            console.log('error with cookies, no position defined');
        }
        $scope.ave = {};
        var average = $cookies.getObject('SearchAverage');
        if (average) {
            //Initialize Map from Cookie
            $scope.ave.food = average.food;
            $scope.ave.price = average.price;
            $scope.ave.ambiece = average.ambiece;
            $scope.ave.distance = average.distance;

        } else {
            console.log('error with cookies, no position defined');
        }

        //Get Restaurant Data
        restaurantService.showRestaurant($stateParams.rId, $scope.loc).then(
            function successCallback(res) {
                $scope.restaurant = res;
                createDiagramm($scope.restaurant.name);
                getScoreColor($scope.restaurant.overall);
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
            }, function errorCallback(res) {
                console.log('error');
                console.log(res);
            });



        //Create Diagramm for Score
        function createDiagramm(rest_name) {

            $scope.scoreDiagramm = {};
            $scope.scoreDiagramm.options = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y: 'bottom',
                    data: [rest_name, 'Average']
                },
                polar: [
                    {
                        indicator: [
                            { text: $translate('SCORES.AMBIENCE'), max: 5 },
                            { text: $translate('SCORES.FOOD'), max: 5 },
                            { text: $translate('SCORES.PRICE'), max: 5 },
                            { text: $translate('SCORES.DISTSCORE'), max: 5 }
                        ]
                    }
                ],
                calculable: true,
                series: [
                    {
                        name: rest_name + ' vs Average',
                        type: 'radar',
                        data: [
                            {
                                value: [$scope.restaurant.ratings.ambience, $scope.restaurant.ratings.ambience, $scope.restaurant.ratings.price, $scope.restaurant.distance_score],
                                name: rest_name,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default'
                                            //  color: 'rgba(19, 185, 175,0.4)'
                                        },
                                    },
                                }
                            },
                            {
                                value: [$scope.ave.food, $scope.ave.price, $scope.ave.ambiece, $scope.ave.distance],
                                name: 'Average',
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default'
                                            //  color: 'rgba(0, 255, 255,0.9)'
                                        },
                                    },
                                }
                            },

                        ]
                    }
                ]
            };


        }

        function getScoreColor(score) {

            score = parseFloat(score);
            var color;
            if ((0 <= score) && (score < 2)) {
                color = 'low-score';
                // color = '#FF4500';
            } else if ((2 <= score) && (score < 4)) {
                color = 'medium-score';
                // color = '#FF8C00';
            } else if ((4 <= score) && (score <= 5)) {
                color = 'high-score';
                // color = '#2E8B57';
            } else {
                color = 'high-score';
                // color = '#99B898';
            }
            $scope.gradecolor = color;
        }


    }


})();
