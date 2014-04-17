import express = require('express');
require('express-resource');
import functions = require('./routes/apis/functions');

export = HttpServer;
class HttpServer {
    listen(port: number) {
        var app = express();

        app.use(express.static(__dirname + '/public'));
        app.resource('api/1/checkport', functions.checkPort);

        var server = app.listen(port, () => {
            console.log('Listening on port %d', server.address().port);
        });
    }
}
