(function () {
    'use strict';

    var web = require('node-static'),
        http = require('http'),
        util = require('util'),
        webroot = './',
        port = process.env.PORT || 8080,
        file = new (web.Server)(webroot, {
            cache: 600,
            headers: { 'X-Powered-By': 'node-static' }
        });

    http.createServer(function (req, res) {
        req.addListener('end', function () {
            file.serve(req, res, function (err, result) {
                if (err) {
                    console.error('Error serving %s - %s', req.url, err.message);
                    if (err.status !== 404 && err.status !== 500) {
                        res.writeHead(err.status, err.headers);
                        res.end();
                    }
                } else {
                    console.log('%s', req.url);
                }
            });
        });
    }).listen(port);

    console.log('node-static running at port %d', port);

}());