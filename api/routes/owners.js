var jwt = require('jsonwebtoken');
var moment = require('moment');
var tokenSecret = 'someSecret';
var safeFields = 'email';

//Owners
exports.getOwners = function(req, res, next) {
    var fields = safeFields;
    if (req.query.fields) {
        fields = req.query.fields.replace(",", " ");
    }
    req.db.Owner.findOwnersByParams(req.query, fields, function(err, data) {
        if (err) return next(err);
        console.log(data.length);
        if (data.length === 0) {
            res.status(204).json(data)
        } else {
            res.status(200).json(data);
        }
    })
};

exports.getOwner = function(req,  res, next) {
    var fields = safeFields;
    if (req.query.fields) {
        fields = req.query.fields.replace(",", " ");
    }
    req.db.Owner.findProfileById(req.params.ownerId, fields, function(err, data) {
        if (err) return next(err);
        res.status(200).json(data);
    })
};

exports.addOwner = function(req, res, next) {
    var owner = new req.db.Owner(req.body);
    owner.save(function(err) {
        if (err) {
            res.status(400).json({
                message: "Error in saving record" + req.params.id
            });
        } else {
            res.status(201).json(owner);
        }
    });
};

exports.updateOwner = function(req, res, next) {
    req.db.Owner.findByIdAndUpdate(req.params.ownerId, req.body, function(err, owner) {
        if (err) {
            res.status(400).json({
                message: "Error in updating record" + req.params.id
            });
        } else {
            res.status(200).json(owner);
        } 
    });
};

exports.deleteOwner = function(req, res, next) {
    req.db.Owner.findByIdAndRemove(req.params.ownerId, function(err, response) {
        if (err) {
            res.status(400).json({
                message: "Error in deleting record" + req.params.id
            });
        } else {
            res.status(200).json({});
        }        
    });
};