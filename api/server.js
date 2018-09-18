var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var logger = require('morgan');
var mongoose = require('mongoose');
var models = require('./models');
var routes = require('./routes');
var config = require('config');

var app = express();
app.set('port', config.server.port);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//This is to allow to get req from the same server as us
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// We are going to protect /api routes with JWT
var expressJwt = require('express-jwt');
var someSecret = "someSecret";
// app.use('/api', expressJwt({
//     secret: someSecret
// }));


var dbUrl = config.mongoDb.uri;
var connection = mongoose.createConnection(dbUrl);
connection.on('error', console.error.bind(console,
    'connection error:'));
connection.once('open', function () {
    console.info('>>>>>>>>>> Connected to database')
});

function db(req, res, next) {
    req.db = {
        User: connection.model('User', models.User, 'users'),
        Owner: connection.model('Owner', models.Owner, 'owners'),
        Restaurant: connection.model('Restaurant', models.Restaurant, 'restaurants')
    };
    return next();
}

var ensureAuthenticated = routes.main.ensureAuthenticated;

//MAIN
app.post('/apii/login', db, routes.main.login);
app.post('/apii/logout', routes.main.logout);
app.post('/apii/login/owner', db, routes.main.loginOwner);

//Users
app.get('/api/users', db, routes.users.getUsers);
app.get('/api/users/:userId', db, routes.users.getUser);
app.post('/apii/users/', db, routes.users.addUser);
app.put('/api/users/:userId', db, routes.users.updateUser);
app.delete('/api/users/:userId', db, routes.users.deleteUser);
app.get('/apii/users/profile/:profileId', db, routes.users.profileUser);

//Owners
app.get('/api/owners', db, routes.owners.getOwners);
app.get('/api/owners/:ownerId', db, routes.owners.getOwner);
app.post('/apii/owners/', db, routes.owners.addOwner);

//Restaurants
app.get('/api/restaurants', db, routes.restaurants.getRestaurants);
app.get('/api/restaurants/:restaurantId', db, routes.restaurants.getRestaurant);
app.get('/api/restaurants/foreign/:fId', db, routes.restaurants.getRestaurantForeign);
app.post('/api/restaurants/', db, routes.restaurants.addRestaurant);
app.put('/api/restaurants/:restaurantId', db, routes.restaurants.updateRestaurant);

//Athena
app.post('/api/athena/search', routes.athena.searchRestaurants);
app.post('/api/athena/restaurant', routes.athena.getRestaurant);

//Log
app.post('/api/log/event', routes.logger.logEvent);
app.get('/api/log/logger', routes.logger.Logger);

function logErrors(err, req, res, next) {
    if (typeof err === 'string')
        err = new Error(err);
    console.error('logErrors', err.toString());
    next(err);
}
app.use(logErrors);

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        console.error('clientErrors response');
        res.status(500).json({
            error: err.toString()
        });
    } else {
        next(err);
    }
}
app.use(clientErrorHandler);

function errorHandler(err, req, res, next) {
    console.error('lastErrors response');
    res.status(500).send(err.toString());
}
app.use(errorHandler);

app.listen(process.env.PORT || app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;