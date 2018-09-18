var jwt = require('jsonwebtoken');
var moment = require('moment');
var tokenSecret = 'someSecret';

exports.login = function(req, res, next) {
    console.log('Loging in USER with email:', req.body.email)
    req.db.User.findOne({
            email: req.body.email
        }, null, {
            safe: true
        },
        function(err, user) {
            if (err) return next(err);
            if (!user) return res.send(401, 'User does not exist');
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (!isMatch) return res.send(401, 'Invalid email and/or password');
                var token = jwt.sign({
                        user: user,
                        iat: Math.floor(Date.now() / 1000) - 30
                    },
                    tokenSecret
                );
                res.send({
                    userId: user._id,
                    token: token,
                    name:user.displayName,
                });
            });
        });
};

exports.logout = function(req, res) {
    console.info('Logout USER: ' + req.session.userId);
    req.session.destroy(function(error) {
        if (!error) {
            res.send({
                msg: 'Logged out'
            });
        }
    });
};

exports.ensureAuthenticated = function(req, res, next) {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        try {
            var decoded = jwt.decode(token);
            req.user = decoded.user;
            return next();
        } catch (err) {
            return res.send(500, 'Error parsing token');
        }
    } else {
        return res.send(401);
    }
}

/* Manage Owners */
exports.loginOwner = function(req, res, next) {
    console.log('Loging in OWNER with email:', req.body.email)
    req.db.Owner.findOne({
            email: req.body.email
        }, null, {
            safe: true
        },
        function(err, owner) {
            if (err) return next(err);
            if (!owner) return res.send(401, 'Owner does not exist');
            owner.comparePassword(req.body.password, function(err, isMatch) {
                if (!isMatch) return res.send(401, 'Invalid email and/or password');
                var token = jwt.sign({
                        owner: owner,
                        iat: Math.floor(Date.now() / 1000) - 30
                    },
                    tokenSecret
                );
                res.send({
                    ownerId: owner._id,
                    token: token,
                    name:owner.name,
                    surname:owner.surname
                });
            });
        });
};
