//Functionality regarding restaurants
(function () {
    'use strict';
    angular
        .module('app.restaurant')
        .service('restaurantService', restaurantService);

    restaurantService.$inject = ['$http', '$rootScope', 'helperService'];

    function restaurantService($http, $rootScope, helperService) {

        //Get a single Restaurant (Athena)
        var showRestaurant = function (rId, loc) {
            var query = {};
            query.rest_id = angular.copy(rId);
            var req = {
                method: 'POST',
                url: $rootScope.basePath + '/api/athena/restaurant',
                data: query
            }
            return $http(req).then(
                function successCallback(res) {
                    var restaurant = res.data;
                    if (restaurant.hour) {
                        restaurant.OpenHours = helperService.setDayProgam(restaurant.hours);
                    }
                    var cal_restaurant = calRestaurant(restaurant, loc);
                    return cal_restaurant;

                },
                function errorCallback(res) {
                    console.log("error API");
                    console.log(res);
                    return false;
                }
            );

        };

        //Get a single Restaurant for Onwer View  (Athena)
        var showRestaurantOwner = function (rId) {
            var query = {};
            query.rest_id = angular.copy(rId);
            var req = {
                method: 'POST',
                url: $rootScope.basePath + '/api/athena/restaurant',
                data: query
            };
            return $http(req).then(
                function successCallback(res) {
                    var restaurant = res.data;
                    restaurant.OpenHours = helperService.setDayProgam(restaurant.hours);
                    return restaurant;
                },
                function errorCallback(res) {
                    console.log("error API");
                    console.log(res);
                    return false;
                }
            );

        };


        //Get Restaurant (Local)
        var getRestaurant = function (rId) {
            return $http.get($rootScope.basePath + '/api/restaurants/foreign/' + rId).then(
                function successCallback(res) {
                    return res;
                },
                function errorCallback(res) {
                    console.log('error');
                    console.log(res);
                    return false;
                }
            );
        };

        //Add a restaurant (Local)
        var postRestaurant = function (rest, rId) {
            rest.fid = rest.id;
            delete rest.id;
            var req = {
                method: 'POST',
                url: $rootScope.basePath + '/api/restaurants/',
                data: rest
            };
            return $http(req).then(
                function successCallback(res) {
                    return res;
                },
                function errorCallback(res) {
                    console.log('error');
                    console.log(res);
                    return false;
                }
            );
        };

        //Update a restaurant (Local)
        var putRestaurant = function (rest) {
            var req = {
                method: 'PUT',
                url: $rootScope.basePath + '/api/restaurants/' + rest._id,
                data: rest
            };
            return $http(req).then(
                function successCallback(res) {
                    return res;
                },
                function errorCallback(res) {
                    console.log('error');
                    console.log(res);
                    return false;
                }
            );
        };


        //Make Calculations for Restaurant
        var calRestaurant = function (r, query) {
            //Calculate Distance
            r.distance = helperService.calculateDistance(query.lat, query.lng, r.lat, r.lng);
            r.distance_score = helperService.mapDistanceScore(r.distance);
            r.distance = Math.round(r.distance * 1000);
            //Calculate Overall Score
            var overall = r.ratings.food / 4 + r.ratings.price / 4 + r.ratings.ambience / 4 + r.distance_score / 4;
            r.overall = parseFloat(overall.toFixed(1));
            var foodprice = r.ratings.food / 2 + r.ratings.price / 2;
            r.foodprice = parseFloat(foodprice.toFixed(1));
            r.ambience = r.ratings.ambience;
            return r;
        };

        return {
            showRestaurant: showRestaurant,
            showRestaurantOwner: showRestaurantOwner,
            getRestaurant: getRestaurant,
            postRestaurant: postRestaurant,
            putRestaurant: putRestaurant,
            calRestaurant: calRestaurant
        };
    }

})();
