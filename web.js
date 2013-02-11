(function () {
    'use strict';

    // Settings
    var webroot = './', // root directory for static files
        port = process.env.PORT || 8080, // uses environment variable if set, otherwise default to 8080

    // Node Modules
        web = require('node-static'),
        http = require('http'),
        util = require('util'),

    // Create a static file server using node-static module
        file = new (web.Server)(webroot, {
            cache: 600,
            headers: { 'X-Powered-By': 'node-static' }
        });

    // Create a http server using http module
    http.createServer(function (request, response) {
        // Add event listener for request 'end'
        request.addListener('end', function () {
            // Serve requested file
            file.serve(request, response, function (err, result) {
                if (err) {
                    // Super basic error handling
                    console.error('Error serving %s - %s', request.url, err.message);
                    response.writeHead(err.status, err.headers);
                    response.end();
                } else {
                    // Log served file for debugging
                    console.log('%s', request.url);
                }
            });
        });
    }).listen(port);

    console.log('node-static running on port %d', port);

}());