import express = require('express');
require('express-resource');
import functions = require('./infrastructure/functions');

export = HttpServer;
class HttpServer {
    listen(port: number) {
        var app = express();
        app.use((req: express.Request, res: express.Response, next: () => void) => {
            functions.checkPort(req.ip, 7144)
                .then((val) => {
                    if (val) {
                        next();
                        return;
                    }
                    res.send(401);
                })
                .catch((e: any) => {
                    console.error(e);
                });
        });
        app.use(express.static(__dirname + '/public'));
        app.resource('api/1/checkport', functions.checkPort);

        var server = app.listen(port, () => {
            console.log('Listening on port %d', server.address().port);
        });
    }
}

function useSession(app: express.Express) {
}