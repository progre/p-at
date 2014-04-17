/// <reference path="typings/tsd.d.ts"/>
/// <reference path="typings/log4js.d.ts"/>

require('source-map-support').install();
import log4js = require('log4js');
import HttpServer = require('./httpserver');

var port = parseInt(process.argv[2], 10) || 8080;

new HttpServer().listen(port);
