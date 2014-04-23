import log4js = require('log4js');
import express = require('express');
import functions = require('../infrastructure/functions');

var logger = log4js.getLogger('server');

export = channel;
var channel = {
    index: (req: express.Request, res: express.Response) => {
        function onSuccess() {
            var list: number[] = [];
            for (var i = 0; i < 100; i++) {
                list.push(i);
            }
            res.send({
                portConnectable: true,
                channels: list
            });
        }

        var session: any = req.session;
        if (session.portConnectable) {
            onSuccess();
            return;
        }
        var ip = req.headers['x-forwarded-for'] || req.ip;
        logger.debug(ip + 'のポート開放状況は不明です');
        functions.checkPort(ip, session.port || 7144)
            .then(val => {
                if (val) {
                    logger.debug('ポートが開放されていることを確認しました');
                    session.portConnectable = true;
                    onSuccess();
                    return;
                }
                logger.debug('ポートは解放されていません');
                res.send({ portConnectable: false });
            }).catch((e: any) => {
                logger.debug('ポート開放状況の確認中にエラーが発生しました');
                logger.error(e);
                res.send(500);
            });
    }
};
