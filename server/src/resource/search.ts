import log4js = require('log4js');
import Enumerable = require('linq');
import express = require('express');
import functions = require('../infrastructure/functions');
import YPWatcher = require('../infrastructure/ypwatcher');

var logger = log4js.getLogger('server');

export function controller(ypWatcher: YPWatcher) {
    return {
        index: (req: express.Request, res: express.Response) => {
            functions.requirePortConnectable(req,
                () => {
                    var channel = Enumerable.from(ypWatcher.channels)
                        .where(x => x.name === req.param('name'))
                        .firstOrDefault();
                    res.send({
                        portConnectable: true,
                        id: channel.id,
                        ip: channel.ip,
                        type: channel.type
                    });
                },
                () => {
                    res.send({
                        portConnectable: false,
                        id: '',
                        ip: '',
                        type: ''
                    });
                }, () => {
                    res.send(500);
                });
        }
    };
}
