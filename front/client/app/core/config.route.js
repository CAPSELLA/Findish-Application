(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$httpProvider','filepickerProvider',
            function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider,filepickerProvider) {
                filepickerProvider.setKey('Apb2kEIBuRVuNIGo7EdARz');
                var routes, setRoutes;

                routes = [
                    'ui/cards', 'ui/typography', 'ui/buttons', 'ui/icons', 'ui/grids', 'ui/widgets', 'ui/components', 'ui/timeline', 'ui/lists', 'ui/pricing-tables',
                    'table/static', 'table/responsive', 'table/data',
                    'form/elements', 'form/layouts', 'form/validation',
                    'chart/echarts', 'chart/echarts-line', 'chart/echarts-bar', 'chart/echarts-pie', 'chart/echarts-scatter', 'chart/echarts-more',
                    'page/404', 'page/500', 'page/blank', 'page/forgot-password', 'page/invoice', 'page/lock-screen', 'page/profile', 'page/signin', 'page/signup',
                    'app/calendar'
                ]

                setRoutes = function (route) {
                    var config, url;
                    url = '/' + route;
                    config = {
                        url: url,
                        templateUrl: 'app/' + route + '.html'
                    };
                    $stateProvider.state(route, config);
                    return $stateProvider;
                };

                routes.forEach(function (route) {
                    return setRoutes(route);
                });


                $stateProvider
                    .state('home', {
                        url: '/',
                        templateUrl: 'app/page/home.html',
                    })
                    .state('terms', {
                        url: '/terms',
                        templateUrl: 'app/page/terms.html',
                    })
   
                    .state('login', {
                        url: '/login',
                        templateUrl: 'app/login/login.html',
                        controller: 'loginCtrl',
                        controllerAs: 'li',
                        data: {
                            requireLogin: false
                        }
                    })
                    .state('loginOwner', {
                        url: '/login/owner',
                        templateUrl: 'app/login/loginOwner.html',
                        controller: 'loginOwnerCtrl',
                        data: {
                            requireLogin: false
                        }
                    })
                    .state('profile', {
                        url: '/profile/',
                        templateUrl: 'app/profile/profile.html',
                        controller: 'profileCtrl'
                    })
                    .state('profileOwner', {
                        url: '/profile/owner',
                        templateUrl: 'app/profile/profileOwner.html',
                        controller: 'profileOwnerCtrl'
                    })
                    .state('search', {
                        url: '/search',
                        templateUrl: 'app/search/search.html',
                        controller: 'searchCtrl'
                    })
                    .state('searchOwner', {
                        url: '/search/owner',
                        templateUrl: 'app/search/searchOwner.html',
                        controller: 'searchOwnerCtrl'
                    })
                    .state('restaurant', {
                        url: '/restaurant/:rId',
                        templateUrl: 'app/restaurant/restaurant.html',
                        controller: 'restaurantCtrl',
                    })
                    .state('restaurantOwner', {
                        url: '/restaurant/owner/:rId',
                        templateUrl: 'app/restaurant/restaurantOwner.html',
                        controller: 'restaurantOwnerCtrl',
                    })
                    .state('editRestaurant', {
                        url: '/restaurant/edit/:rId',
                        templateUrl: 'app/restaurant/restaurantEdit.html',
                        controller: 'restaurantEditCtrl',
                    });

                $urlRouterProvider
                    .when('/', '/')
                    .otherwise('/');

                $httpProvider.interceptors.push(function () {
                    return {
                        request: function (config) {
                            /* if (localStorage.auth) {
                                 config.headers = config.headers || {};
                                 config.headers.Authorization = localStorage.auth;
                             }*/
                            config.headers['Content-Type'] = 'application/json';
                            return config;
                        }
                    };

                });

            }

        ]);

})();
