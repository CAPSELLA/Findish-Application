var objectId = require('mongodb').ObjectID;

exports.getRestaurants = function(req, res, next) {
    req.db.Restaurant.findRestaurants(req.query, function(err, data) {
        if (err) return next(err);
        console.log(data.length);
        if (data.length === 0) {
            res.status(204).json(data)
        } else {
            res.status(200).json(data);
        }
    })
};

exports.getRestaurant = function (req, res, next) {
    req.db.Restaurant.findRestaurantById(req.params.restaurantId, function (err, data) {
        if (req.user._id == data.author) {
            if (err) return next(err);
            console.log(data.length);
            if (data.length === 0) {
                res.status(204).json({ "msg": "Not found" })
            } else {
                res.status(200).json(data);
            }
        } else {
            res.status(401).json("Unauthorized");
        }
    })
};

exports.getRestaurantForeign = function (req, res, next) {
    if (req.params.fId) {
        req.db.Restaurant.findRestaurantsByFid(req.params.fId, function (err, data) {
            if (err) return next(err);
            console.log(data.length);
            if (data.length === 0) {
                res.status(204).json(data)
            } else {
                res.status(200).json(data);
            }
        })

    } else {
        res.status(401).json("No fid defined");
    }
};


exports.addRestaurant = function (req, res, next) {
    var restaurant = new req.db.Restaurant(req.body);
    restaurant.save(function (err) {
        if (err) {
            res.status(400).json({
                message: "Error in saving record"
            });
        } else {
            res.status(201).json(restaurant);
        }
    });
};



exports.updateRestaurant = function(req, res, next) {
    req.db.Restaurant.findByIdAndUpdate(req.params.restaurantId, req.body, function(err, restaurant) {
        if (err) {
            res.status(400).json({
                message: "Error in updating record" + err
            });
        } else {
            res.status(200).json(restaurant);
        } 
    });
};