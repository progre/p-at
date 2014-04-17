import http = require('http');
import express = require('express');

export var checkPort = {
    index: (req: express.Request, res: express.Response) => {
        req.params.checkport = 7144;
        checkPort.show(req, res);
    },
    show: (req: express.Request, res: express.Response) => {
        http.get('http://' + req.ip + ':' + req.params.checkport,
            () => {
                res.send(true);
            }).on('error', () => {
                res.send(403, false);
            });
    }
};
