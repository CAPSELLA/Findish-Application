var request = require('request');

//Athena API
exports.searchRestaurants = function (req, res, next) {

    //Set Up Req Options
    var url = 'http://dataservices.ilsp.gr:29928/meal_prediction_pilot/get_list_2';
    var req_options = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    request(req_options).json(req.body).pipe(res);

};

exports.getRestaurant = function (req, res, next) {

    //Set Up Req Options
    var url = 'http://dataservices.ilsp.gr:29928/meal_prediction_pilot/get_restaurant_info_2';
    var req_options = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    request(req_options).json(req.body).pipe(res);

};