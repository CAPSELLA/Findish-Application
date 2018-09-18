(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('searchCtrl', searchCtrl)
        .controller('occasionCtrl', occasionCtrl);

    searchCtrl.$inject = ['$scope', '$location', '$cookies', '$filter', '$uibModal', 'NgMap', 'searchService', 'helperService', '$state'];
    occasionCtrl.$inject = ['$uibModalInstance', 'meal'];

    function searchCtrl($scope, $location, $cookies, $filter, $uibModal, NgMap, searchService, helperService, $state) {

        //Translate Filter
        var $translate = $filter('translate');

        /* Initialization */
        $scope.displayShowMore = false;
        $scope.oneAtATime = true;

        //Initialize Search
        var searchCookie = $cookies.getObject('SearchQuery');
        if (searchCookie) {
            $scope.search = searchCookie;
            //Initialize Map from Cookie
            $scope.search_location = [searchCookie.lat, searchCookie.lng];
            $scope.search_adress = searchCookie.Adress;
            //Show the search results from cookie
            searchRestaurants();
        } else {
            $scope.search = {};
            //Ask for Occasion
            occasionModal();
            //Ask for current location
            getcurrent_location();
        }

        //Default sorting
        $scope.order_by = "overall";
        $scope.order_reverse = true;

        /* Front End Function */

        //Reset to geolocation if changes
        $scope.locateMe = function () {
            getcurrent_location();
        }

        //Send search request
        $scope.sendSearch = function () {
            $scope.error = "";
            $scope.search.lat = $scope.search_location[0];
            $scope.search.lng = $scope.search_location[1];
            $scope.search.Adress = $scope.search_adress;
            searchRestaurants();
        };

        //Show restaurant
        $scope.showRest = function (rid) {
            $location.url('/restaurant/' + rid);
            var event = {
                type: 'RestClick',
                rid: rid
            }


            helperService.logEvent(event);

        };

        //Reorder restaurants
        $scope.orderRest = function (orderby) {
            $scope.order_by = orderby;
            if (orderby == 'distance') {
                $scope.order_reverse = false;
            } else {
                $scope.order_reverse = true;
            }
        }

        //Search The Adress
        $scope.placeChanged = function () {
            var place = this.getPlace();
            $scope.search_location = [place.geometry.location.lat(), place.geometry.location.lng()];
        }

        //Show More
        $scope.showMore = function () {
            $scope.displayShowMore = false;
            $scope.restlimit = 10;
        }


        /* Modals */

        //Occasion Modal
        function occasionModal() {
            var parentElem = angular.element(document.body);
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/search/modals/occasion.html',
                appendTo: parentElem,
                controller: occasionCtrl,
                controllerAs: '$occ',
                resolve: {
                    meal: function () {
                        return $scope.search.meal;
                    }
                }
            });

            modalInstance.result.then(function (meal) {
                $scope.search.meal = meal;
            }, function () {
            });

        }

        $scope.openOccasion = function () {
            occasionModal();
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

        //Get current location
        function getcurrent_location() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.$evalAsync(function () {
                        $scope.search_location = [position.coords.latitude, position.coords.longitude];
                        $scope.search_adress = $translate('YOURLOCATION');
                    })
                });
            }
        }


        function searchRestaurants() {

            $scope.noresults = false;
            $scope.isSearch = false;
            searchService.sendSearch($scope.search).then(function (res) {

                $cookies.putObject("SearchQuery", $scope.search);
                $scope.hasdata = res;

                /*Start Search Features*/

                var featuresRest = [];
                var index = [];

                angular.forEach($scope.hasdata, function (value) {
                    this.push(value.features);
                }, featuresRest);

                angular.forEach($scope.hasdata, function (value) {
                    this.push(value.id);
                }, index);

                /*Unique features*/

                validation(featuresRest, index);

                function validation(featuresRest, index) {
                    for (var i = 0; i < featuresRest.length; i++) {
                        $scope.restFetaure = Object.assign({}, featuresRest[i]);
                    }
                }

                /*Push  Unique Seach Value*/

                var searchValuesArray = [];
                $scope.uniqueStandards = {};

                $scope.searchValues = function (val) {

                    var cleanArray = (searchValuesArray.indexOf(val) > -1);
                    $scope.isSearch = true;

                    if (cleanArray) {
                        for (var i = searchValuesArray.length - 1; i >= 0; i--) {
                            if (searchValuesArray[i] === val) {
                                searchValuesArray.splice(i, 1);
                            }
                        }
                        $scope.result = {};
                        $scope.result = searchRestaurantId(searchValuesArray);
                        $scope.uniqueStandards = UniqueArray($scope.result, "id");
                        if ($scope.uniqueStandards.length === 0) {
                            $scope.isSearch = false;
                        }
                    } else {

                        $scope.result = {};
                        searchValuesArray.push(val);
                        $scope.result = searchRestaurantId(searchValuesArray);
                        $scope.uniqueStandards = UniqueArray($scope.result, "id");
                    }


                };

                /*Find Restaurant Id by Unique Seach Value*/

                function searchRestaurantId(valArray) {
                    $scope.finalResvalue = {};
                    var j = 0;
                    $scope.findindexofvalue = [];
                    for (var i = valArray.length - 1; i >= 0; i--) {

                        angular.forEach($scope.hasdata, function (keys, values) {
                            angular.forEach(keys.features, function (value) {

                                if (valArray[i] === value) {

                                    $scope.finalResvalue[j] = {
                                        id: keys.id,
                                        name: keys.name,
                                        overall: keys.overall,
                                        ambience: keys.ambience,
                                        distance: keys.distance_score,
                                        foodprice: keys.foodprice

                                    };
                                    //    $scope.findindexofvalue.push(keys.id);
                                    j++;
                                }
                            });
                        });
                    }
                    console.log($scope.finalResvalue);
                    return $scope.finalResvalue
                };


                /*End Search Features*/


                /*Start Search Cuisine*/

                var featuresCuisine = [];
                var getCusine = [];


                angular.forEach($scope.hasdata, function (value) {
                    this.push(value.cuisine);
                }, featuresCuisine);


                angular.forEach(featuresCuisine, function (keys, values) {
                    angular.forEach(keys, function (key, value) {
                        this.push(key);
                    }, getCusine);
                });

                /*Unique cuisine*/

                $scope.uniqueCuisineNames = uniqueCuisine(getCusine);
                function uniqueCuisine(getCusine) {
                    var newArr = [];
                    angular.forEach(getCusine, function (value, key) {
                        var exists = false;
                        angular.forEach(newArr, function (val2, key) {
                            if (angular.equals(value, val2)) {
                                exists = true
                            }
                        });
                        if (exists === false && value !== "") {
                            newArr.push(value);
                        }
                    });

                    return newArr;
                }


                var searchValuesCuisine = [];

                $scope.searchCuisine = function (val) {
                    $scope.isSearch = true;
                    var cleanArray = (searchValuesCuisine.indexOf(val) > -1);

                    if (cleanArray) {

                        for (var i = searchValuesCuisine.length - 1; i >= 0; i--) {
                            if (searchValuesCuisine[i] === val) {
                                searchValuesCuisine.splice(i, 1);
                            }
                        }
                        $scope.result = {};
                        $scope.result = searchRestaurantId(searchValuesArray);
                        $scope.uniqueStandards = UniqueArray($scope.result, "id");
                        if ($scope.uniqueStandards.length === 0) {
                            $scope.isSearch = false;
                        }

                        console.log('true');

                    } else {

                        $scope.resultCuisine = {};
                        searchValuesCuisine.push(val);
                        $scope.resultCuisine = searchRestaurantCuisineId(searchValuesCuisine);
                        $scope.uniqueStandards = UniqueArray($scope.resultCuisine, "id");
                        console.log($scope.uniqueStandards);

                    }


                };

                /*Find Restaurant Id by Unique Search Value for Cuisine*/

                    function searchRestaurantCuisineId(valArray) {

                    $scope.finalResvalue = {};
                    var j = 0;
                    $scope.findindexofvalue = [];

                    for (var i = valArray.length - 1; i >= 0; i--) {

                        angular.forEach($scope.hasdata, function (keys) {

                            angular.forEach(keys.cuisine, function (value) {

                                if (valArray[i] === value) {
                                    $scope.finalResvalue[j] = {
                                        id: keys.id,
                                        name: keys.name,
                                        overall: keys.overall,
                                        ambience: keys.ambience,
                                        distance: keys.distance_score,
                                        foodprice: keys.foodprice

                                    };
                                    j++;
                                }
                            });
                        });
                    }

                    return $scope.finalResvalue
                }

                /*End Search cuisine*/

                /*Clean Array by id*/

                     function UniqueArray(collection, keyname) {
                    var output = [],
                        keys = [];
                    angular.forEach(collection, function (item) {
                        var key = item[keyname];
                        if (keys.indexOf(key) === -1) {
                            keys.push(key);
                            output.push(item);
                        }
                    });
                    return output;
                }

                /*End Clean Array by id*/

                if (res === 'no-results') {
                    $scope.noresults = true;
                    $scope.restaurant_list = null;
                } else {
                    $scope.noresults = false;
                    $scope.restaurant_list = res;
                    $scope.restlimit = 5;
                    if ($scope.restaurant_list.length > $scope.restlimit) {
                        $scope.displayShowMore = true;
                    } else {
                        $scope.displayShowMore = false;
                    }
                    // Add average as cookie
                    var average = searchService.calculateAverage($scope.restaurant_list);
                    $cookies.putObject("SearchAverage", average);
                }

            });
        }

    }

    //Occasion Ctrl
    function occasionCtrl($uibModalInstance, meal) {
        var $occ = this;
        if (meal) {
            $occ.meal = meal;
        }
        $occ.ok = function () {
            $uibModalInstance.close($occ.meal);
        };

        $occ.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


})();
