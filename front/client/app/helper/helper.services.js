/* S1. Service to handle Vehicles */
(function () {
    'use strict';
    angular
    
        .module('app.helper')
        .factory('helperService', helperService);

    helperService.$inject = ['$http','$cookies'];

    function helperService($http,$cookies) {

        var logEvent = function(event){
            
            var event = angular.copy(event);
           
            event.user = $cookies.getObject('user');
            event.time = new Date();

            var req = {
                method: 'POST',
                url: 'https://meal-api.herokuapp.com/api/log/event',
                data: event
            };

            return $http(req).then(
                function successCallback(res) {
            
                    return true ;
                }, function errorCallback(res) {
                    console.log(res.data.message);
                    return  false;
                }
            );

        };

        var getCuisines = function () {

            return $http.get('app/helper/cuisines.json').then(function successCallback(res) {
                return res.data;
            });

        };

        var setDayProgam = function(hours) {

            //See what day it is
            var d = new Date();
            var n = d.getDay();
            var OpenHours;

            switch (n) {
                case 0:
                    OpenHours = hours.Sun;
                    break;
                case 1:
                    OpenHours = hours.Mon;
                    break;
                case 2:
                    OpenHours = hours.Tue;
                    break;
                case 3:
                    OpenHours = hours.Wed;
                    break;
                case 4:
                    OpenHours = hours.Thu;
                    break;
                case 5:
                    OpenHours = hours.Fri;
                    break;
                case 6:
                    OpenHours = hours.Sat;
                    break;
                default:
                    OpenHours = false;
            }
            return OpenHours
        }

        var calculateDistance = function (lat1, lon1, lat2, lon2) {

            function deg2rad(deg) { return (deg * Math.PI / 180.0); };
            function rad2deg(rad) { return (rad * 180 / Math.PI); };

            var theta = lon1 - lon2;
            var dist = Math.sin(deg2rad(lat1))
                * Math.sin(deg2rad(lat2))
                + Math.cos(deg2rad(lat1))
                * Math.cos(deg2rad(lat2))
                * Math.cos(deg2rad(theta));
            dist = Math.acos(dist);
            dist = rad2deg(dist);
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344;
            return dist;
        };

        var mapDistanceScore = function (dist) {
             var dist_sc;
             
            if (dist < 0.33) {
                dist_sc = 5;
            } else if (0.33 <= dist < 0.66) {
                dist_sc = 4;
            } else if (0.66 <= dist < 0.99) {
                dist_sc = 3;
            } else if (0.99 <= dist < 1.33) {
                dist_sc = 2;
            } else if (1.33 <= dist < 1.66) {
                dist_sc = 1;
            } else {
                dist_sc = 0;
            }
            return dist_sc;
        }

        return {
            logEvent:logEvent,
            calculateDistance: calculateDistance,
            mapDistanceScore: mapDistanceScore,
            setDayProgam:setDayProgam,
            getCuisines:getCuisines
        };
    }

})();