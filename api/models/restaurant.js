var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var Restaurant = new Schema({
    fid: {
        type: String,
        trim: true
    },
    owner_id: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    desc: {
        type: String,
        trim: true
    },
    pictures:  [ { } ],
    hours: {
        Fri:{
            from: {
                type: String,
            },
            to: {
                type: String,
            },
        },
        Mon:{
            from: {
                type: String,
            },
            to: {
                type: String,
            },
        },
        Sat:{
            from: {
                type: String,
            },
            to: {
                type: String,
            },
        },
        Sun:{
            from: {
                type: String,
            },
            to: {
                type: String,
            },
        },
        Thu:{
            from: {
                type: String,
            },
            to: {
                type: String,
            },
        },
        Tue:{
            from: {
                type: String,
            },
            to: {
                type: String,
            },
        },
        Wed:{
            from: {
                type: String,
            },
            to: {
                type: String,
            },
        }
    }   
});

Restaurant.plugin(findOrCreate);

Restaurant.statics.findRestaurants = function (params, callback) {
    var Restaurant = this;
    var searchObj = {};
    return Restaurant.find(searchObj, function (err, obj) {
        if (err) return callback(err);
        if (!obj) return callback(new Error('No Restaurant found'));
        callback(null, obj);
    });
}

Restaurant.statics.findRestaurantById = function (Restaurantid, callback) {
    var Restaurant = this;
    return Restaurant.findById(Restaurantid, function (err, obj) {
        if (err) return callback(err);
        if (!obj) return callback(new Error('Restaurant is not found'));
        callback(null, obj);
    });
}

Restaurant.statics.findRestaurantsByFid = function (fId, callback) {
    var Restaurant = this;
    var searchObj = {};
    if (fId) {
        searchObj = {
            $or: []
        };
        searchObj.$or.push({
            fid: fId
        });
    }
    return Restaurant.find(searchObj, function (err, obj) {
        if (err) return callback(err);
        if (!obj) return callback(new Error('No Restaurant found'));
        callback(null, obj);
    });
}

module.exports = Restaurant;