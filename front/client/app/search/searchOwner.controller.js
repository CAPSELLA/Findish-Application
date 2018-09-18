(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('searchOwnerCtrl', searchOwnerCtrl);

    searchOwnerCtrl.$inject = ['$scope', '$location', '$cookies', 'NgMap', 'searchService','helperService'];

    function searchOwnerCtrl($scope, $location, $cookies, NgMap, searchService,helperService) {

        /* Initialization */
        $scope.showSearch = false;

        //Initialize Search
        var searchCookie = $cookies.getObject('SearchOwnerQuery');
        if (searchCookie) {
            $scope.search = searchCookie;
            //Initialize Map from Cookie
            $scope.search_location = [searchCookie.lat, searchCookie.lng];
            //Show the search results from cookie
            searchRestaurants();
            $scope.zoom = 18;
        } else {
            $scope.search = {};
            $scope.search_location = [50.0667882,14.4085581];
            $scope.zoom = 12;
        }

        /* Front End Function */

        //Search The Adress
        $scope.findAdress = function () {
            $scope.search_location = angular.copy($scope.search_adress);
            $scope.zoom = 18;
            $scope.showSearch = true;
        }

        //Send search request
        $scope.sendSearch = function () {
            $scope.search.lat = $scope.map.markers[0].position.lat();
            $scope.search.lng = $scope.map.markers[0].position.lng();
            $scope.error = "";
            searchRestaurants();
        };

        //Show restaurant
        $scope.showRest = function (rid) {
            $location.url('/restaurant/owner/' + rid);
            var event = {
                type: 'RestClickOwner',
                rid: rid
            }
            helperService.logEvent(event);
        }

        /* Map Manipulation */
        NgMap.getMap().then(function (map) {
            $scope.map = map;
        });
        //Open InfoWindow
        $scope.showWindowRestaurant = function (event, r) {
            $scope.active_rest_map = r;
            $scope.map.showInfoWindow('rest-wi', this);
        };

        /* Asset Functions */



        function searchRestaurants() {
            $scope.noresults = false;
            searchService.sendSearchOwner($scope.search).then(function (res) {
                $cookies.putObject("SearchOwnerQuery", $scope.search);
                if (res == 'no-results') {
                    $scope.noresults = true;
                    $scope.restaurant_list = null;
                } else {
                    $scope.noresults = false;
                    $scope.restaurant_list = res;

        
                    $scope.restaurantIncluded = [];
                    $scope.includeColour = function(colour) {
                        var i = $.inArray(colour, $scope.restaurantIncluded);
                        if (i > -1) {
                            $scope.restaurantIncluded.splice(i, 1);
                        } else {
                            $scope.restaurantIncluded.push(colour);
                        }
                    };
                    $scope.colourFilter = function(name) {
                        if ($scope.restaurantIncluded.length > 0) {
                            if ($.inArray(name.name, $scope.restaurantIncluded) < 0)
                                return;
                        }

                        return name;
                    }



                }
            });
        }



    }

})();
