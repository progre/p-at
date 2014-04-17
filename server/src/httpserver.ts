import express = require('express');

export = HttpServer;
class HttpServer {
    listen(port: number) {
        var app = express();

        app.use(express.static(__dirname + '/public'));

        var server = app.listen(port, () => {
            console.log('Listening on port %d', server.address().port);
        });
    }
}
