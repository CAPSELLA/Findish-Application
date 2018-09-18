const fs = require('fs');

//Log Events To File
exports.logEvent = function (req, res, next) {

    fs.readFile('logger.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            res.status(400).json({
                message: "Error in readding logger" + err
            });
        } else {
            obj = JSON.parse(data); //now it an object
            obj.data.push(req.body); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('logger.json', json, 'utf8', function (err) {
                if (err) {
                    res.status(400).json({
                        message: "Error in logging event" + err
                    });
                } else {
                    res.status(200).json({
                        message: "Event logged succesfully"
                    });
                }
            }
            ); // write it back 
        }
    });

};


//Return Logger
exports.Logger = function (req, res, next) {

    fs.readFile('logger.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            res.status(400).json({
                message: "Error in readding logger" + err
            });
        } else {
            obj = JSON.parse(data); 
            res.status(200).json(obj);
        }
    });

};

