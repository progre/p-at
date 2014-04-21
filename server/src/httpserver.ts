import express = require('express');
require('express-resource');
var session: typeof express.session = require('express-session');
var cookieParser: typeof express.cookieParser = require('cookie-parser');
import log4js = require('log4js');
import functions = require('./infrastructure/functions');

var logger = log4js.getLogger('server');

export = HttpServer;
class HttpServer {
    listen(port: number) {
        var app = express();
        useSession(app);
        app.use(checkPort);
        app.use(express.static(__dirname + '/public'));
        var server = app.listen(port, () => {
            logger.info('Listening on port %d', server.address().port);
        });
    }
}

function useSession(app: express.Express) {
    app.use(cookieParser('Heart Break'));
    app.use(session({ secret: 'Miserable Fate' }));
}

function checkPort(req: express.Request, res: express.Response, next: () => void) {
    var session: any = req.session;
    if (session.portConnectable) {
        next();
        return;
    }
    logger.debug('ポート開放状況は不明です');
    functions.checkPort(req.ip, 7144)
        .then((val) => {
            if (val) {
                session.portConnectable = true;
                logger.debug('ポートが開放されていることを確認しました');
                next();
                return;
            }
            logger.debug('ポートは解放されていません');
            res.send(401);
        })
        .catch((e: any) => {
            logger.debug('ポート開放状況の確認中にエラーが発生しました');
            console.error(e);
        });
}