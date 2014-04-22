/// <reference path="typings/tsd.d.ts"/>
/// <reference path="typings/log4js.d.ts"/>
/// <reference path="typings/promise.d.ts"/>

require('source-map-support').install();
import fs = require('fs');
import log4js = require('log4js');
import HttpServer = require('./httpserver');

var localIp = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var port = parseInt(process.argv[2], 10) || process.env.OPENSHIFT_NODEJS_PORT || 8080;

var LOG_DIRECTORY = (process.env.OPENSHIFT_DATA_DIR || __dirname + '/../') + 'log';
if (!fs.existsSync(LOG_DIRECTORY)) {
    fs.mkdirSync(LOG_DIRECTORY, '777');
}
log4js.configure({
    appenders: [
        {
            category: 'access',
            type: 'dateFile',
            filename: LOG_DIRECTORY + '/access.log',
            pattern: '-yyyy-MM-dd'
        },
        {
            category: 'server',
            type: 'dateFile',
            filename: LOG_DIRECTORY + '/server.log',
            pattern: '-yyyy-MM-dd'
        },
        {
            category: 'console',
            type: 'console'
        }
    ]
});

new HttpServer().listen(port, localIp);
