var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var findOrCreate = require('mongoose-findorcreate');
//var roles = 'user proUser admin superAdmin'.split(' ');
var status = 'verified notverified'.split(' ');

var Owner = new Schema({
    name:{
        type: String,
        required: true
    },
    surname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    status:{
        type: String,
        trim: true
    },
    stripeToken: Schema.Types.Mixed
});

Owner.plugin(findOrCreate);

Owner.pre('save', function(next) {
    var owner = this;
    if (!owner.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(owner.password, salt, function(err, hash) {
            if (err) return next(err);
            owner.password = hash;
            next();
        });
    });
});

Owner.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

Owner.statics.findProfileById = function(id, fields, callback) {
    var Owner = this;
    return Owner.findById(id, fields, function(err, obj) {
        if (err) return callback(err);
        if (!obj) return callback(new Error('Owner is not found'));
        callback(null, obj);
    });
}

Owner.statics.findOwnersByParams = function(params, fields, callback) {
    var Owner = this;
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
        } /*else if (hasOwnProperty('displayName')) {
            searchObj.$or.push({
                email: {
                    $regex: params.displayName,
                    $options: "$i"
                }
            })
        }*/
    }
    return Owner.find(searchObj, fields, function(err, obj) {
        if (err) return callback(err);
        if (!obj) return callback(new Error('No Owner found'));
        callback(null, obj);
    });
}

module.exports = Owner;
