(function () {
    'use strict';
    angular
        .module('app.search')
        .service('searchService', searchService);

    searchService.$inject = ['$http', '$rootScope', '$filter', 'restaurantService', 'helperService'];

    function searchService($http, $rootScope, $filter, restaurantService, helperService) {

        var sendSearch = function (searchQuery) {

            var query = angular.copy(searchQuery);

            var req = {
                method: 'POST',
                url: $rootScope.basePath + '/api/athena/search',
                data: query
            }

            return $http(req).then(
                function successCallback(res) {
                    var restaurants = res.data.results;
                    if (restaurants.length == 0) {
                        restaurants = 'no-results';
                        var restaurants_ids = 'no-results';
                    } else {
                        // Maniputalte Data 
                        restaurants.forEach(function (r) {
                            r = restaurantService.calRestaurant(r, query);
                        });
                        restaurants = $filter('orderBy')(restaurants, 'overall', true);
                        restaurants = $filter('limitTo')(restaurants, 20, 0);
                        var restaurants_ids = restaurants.map(function (a) { return a.id; })
                    }
                    var event = {
                        type: 'Search',
                        query: query,
                        results: restaurants_ids
                    }
                    helperService.logEvent(event);
                    return restaurants;
                }, function errorCallback(res) {
                    console.log("error");
                    console.log(res);
                    return false;
                }
            );

        };

        var calculateAverage = function (restaurants) {

            var caclRestaurants = angular.copy(restaurants);
            var av_length = caclRestaurants.length;
            var av_food = 0;
            var av_price = 0;
            var av_ambiece = 0;
            var av_distance = 0;

            caclRestaurants.forEach(function (r) {
                av_food = av_food + r.ratings.food;
                av_price = av_price + r.ratings.price;
                av_ambiece = av_ambiece + r.ratings.ambience;
                av_distance = av_distance + r.distance_score;
            });


            av_food = av_food / av_length;
            av_price = av_price / av_length;
            av_ambiece = av_ambiece / av_length;
            av_distance = av_distance / av_length;


            var average = {
                food: av_food.toFixed(2),
                price: av_price.toFixed(2),
                ambiece: av_ambiece.toFixed(2),
                distance: av_distance.toFixed(2)
            }

            return average;

        }

        var sendSearchOwner = function (searchQuery) {

            var query = angular.copy(searchQuery);

            var req = {
                method: 'POST',
                url: $rootScope.basePath + '/api/athena/search',
                data: query
            }

            return $http(req).then(
                function successCallback(res) {
                    var restaurants = res.data.results;
                    if (restaurants.length == 0) {
                        restaurants = 'no-results';
                        var restaurants_ids = 'no-results';
                    } else {
                        // Maniputalte Data 
                        restaurants.forEach(function (r) {
                            r = restaurantService.calRestaurant(r, query);
                        });
                        restaurants = $filter('orderBy')(restaurants, 'distance', false);
                        restaurants = $filter('limitTo')(restaurants, 3, 0);
                        var restaurants_ids = restaurants.map(function (a) { return a.id; })
                    }
                    var event = {
                        type: 'SearchOwner',
                        query: query,
                        results: restaurants_ids
                    }
                    helperService.logEvent(event);
                    return restaurants;
                }, function errorCallback(res) {
                    console.log("error");
                    console.log(res);
                    return false;
                }
            );

        };

        return {
            sendSearch: sendSearch,
            calculateAverage: calculateAverage,
            sendSearchOwner: sendSearchOwner
        };
    }

})();
