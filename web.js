(function () {
    'use strict';
    var app, dbMethods = {},

    // Settings
        port = process.env.PORT || 8080, // uses environment variable if set, otherwise default to 8080
        mongodbUrl = process.env.MONGOHQ_URL || 'mongodb://localhost/squidjs',

    // Node Modules
        express = require('express'),
        mongoClient = require('mongodb').MongoClient,
        url = require('url');

    app = express.createServer(
        express['static'](__dirname),
        express.bodyParser()
    );

    app.configure('development', function () {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function () {
        app.use(express.errorHandler());
    });

    app.listen(port, function () {
        console.log('Express server listening on port %d in %s mode', port, app.settings.env);
    });

    mongoClient.connect(mongodbUrl, function (error, db) {
        if (error) {
            console.log('MongoClient.connect: Could not connect to database: ');
            console.log(error);
            return;
        }

        console.log('MongoClient.connect: Connected to our mongodb database.');

        db.collection('scores', function (error, collection) {
            dbMethods.saveScore = function (score, callback) {
                var key;
                if (score.userName === undefined) {
                    score.userName = 'anonymous';
                }

                for (key in score) {
                    if (score.hasOwnProperty(key) && key !== 'userName') {
                        score[key] = parseInt(score[key], 10);
                    }
                }

                collection.insert(score, function (error, results) {
                    if (error) {
                        callback(false);
                    }
                    callback(results);
                });
            };

            dbMethods.getTopTen = function (key, order, callback) {
                var sort = {};
                sort[key] = parseInt(order, 10);

                collection.find().sort(sort).limit(10).toArray(function (error, results) {
                    var i, n, item, output = [];
                    if (error) {
                        callback(false);
                    }

                    for (i = 0, n = results.length; i < n; i += 1) {
                        if (results[i][key]) {
                            item = {
                                userName: results[i].userName,
                                rank: i + 1
                            };
                            item[key] = results[i][key];
                            output.push(item);
                        }
                    }
                    callback(output);
                });
            };

            dbMethods.clear = function (callback) {
                collection.drop(callback);
            };
        });
    });

    app.post('/saveScore', function (request, response) {
        dbMethods.saveScore(request.body.score, function (results) {
            if (results === false) {
                response.send(500, 'Internal error');
            }
            response.send(request.body);
        });
    });

    app.get('/topTen', function (request, response) {
        var parts = url.parse(request.url, true);
        dbMethods.getTopTen(parts.query.key, parts.query.order, function (results) {
            if (results === false) {
                response.send(500, 'Internal error');
            }
            response.json({ topTen: results });
        });
    });

    app.post('/clearScores', function (request, response) {
        dbMethods.clear(function (results) {
            if (results === false) {
                response.send(500, 'Internal error');
            }
            response.send(request.body);
        });
    });
}());