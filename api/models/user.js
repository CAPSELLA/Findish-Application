var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var bcrypt = require('bcryptjs');
var findOrCreate = require('mongoose-findorcreate');
//var roles = 'user proUser admin superAdmin'.split(' ');
var gender = 'male female'.split(' ');
var agegroups = 'a b c d'.split(' ');

var User = new Schema({
    socialprofile:{
        type: String,
        required: true
    },
    displayName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    age:{
        type: String,
        enum:agegroups
    },
    gender: {
        type: String,
        enum: gender
    },
    cuisine:[{
        type: String,
        trim: true
    }]
    //stripeToken: Schema.Types.Mixed
});

User.plugin(findOrCreate);

User.statics.findProfileById = function(id, fields, callback) {
    var User = this;
    return User.findById(id, fields, function(err, obj) {
        if (err) return callback(err);
        if (!obj) return callback(new Error('User is not found'));
        callback(null, obj);
    });
}

User.statics.findUsersByParams = function(params, fields, callback) {
    var User = this;
    var searchObj = {};
    if (Object.keys(params).length > 0) {
        searchObj = {
            $or: []
        };
        if (params.hasOwnProperty('email')) {
            searchObj.$or.push({
                email: {
                    $regex: params.email,
                    $options: "$i"
                }
            })
        } else if (hasOwnProperty('displayName')) {
            searchObj.$or.push({
                email: {
                    $regex: params.displayName,
                    $options: "$i"
                }
            })
        }
    }
    return User.find(searchObj, fields, function(err, obj) {
        if (err) return callback(err);
        if (!obj) return callback(new Error('No User found'));
        callback(null, obj);
    });
}

module.exports = User;