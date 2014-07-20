import express = require('express');
require('express-resource');
var session: typeof express.session = require('express-session');
var cookieParser: typeof express.cookieParser = require('cookie-parser');
import log4js = require('log4js');
import functions = require('./infrastructure/functions');
import YPWatcher = require('./infrastructure/ypwatcher');
import channels = require('./resource/channels');
import search = require('./resource/search');

var logger = log4js.getLogger('server');
var accessLogger = log4js.getLogger('access');

export = HttpServer;
class HttpServer {
    private app = express();
    private ypWatcher: YPWatcher;

    listen(port: number, localIp: string) {
        this.ypWatcher = new YPWatcher(80);
        this.ypWatcher.beginWatchYP();
        this.startWebServer(this.app, port, localIp, this.ypWatcher);
        log4js.getLogger('console').debug('debug mode.');// log4jsからコンソールへ何かしらの出力をしないと、grunt serveのwatchが効かなくなる
    }

    private startWebServer(app: express.Express, port: number, localIp: string, ypWatcher: YPWatcher) {
        app.get('/*', (req: express.Request, res: express.Response, next: () => void) => {
            if (req.host.match(/^www/) == null) {
                return next();
            }
            res.redirect('http://' + req.host.replace(/^www\./, '') + req.url);
        });
        app.use(log);
        useSession(app);
        app.use(express.static(__dirname + '/public'));
        app.resource('api/1/channels', channels.controller(ypWatcher));
        app.resource('api/1/search', search.controller(ypWatcher));
        app.use((req: express.Request, res: express.Response)
            => res.sendfile(__dirname + '/public/index.html'));

        var server = app.listen(port, localIp, () => {
            logger.info('Listening on port %d', server.address().port);
        });
    }
}

function log(req: express.Request, res: express.Response, next: () => void) {
    accessLogger.info([
        req.headers['x-forwarded-for'] || req.ip,
        new Date().toLocaleString(),
        req.method,
        req.url,
        res.statusCode,
        req.headers['referer'] || '-',
        req.headers['user-agent'] || '-'
    ].join('\t'));
    next();
}

function useSession(app: express.Express) {
    app.use(cookieParser('Heart Break'));
    app.use(session({ secret: 'Miserable Fate' }));
}
