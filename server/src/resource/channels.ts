import log4js = require('log4js');
import Enumerable = require('linq');
import express = require('express');
import functions = require('../infrastructure/functions');
import YPWatcher = require('../infrastructure/ypwatcher');

var logger = log4js.getLogger('server');

// classにしたいけど、thisが上手く作用しないので無理
export function controller(ypWatcher: YPWatcher) {
    return {
        index: (req: express.Request, res: express.Response) => {
            requirePortConnectable(req,
                () => {
                    logger.debug('チャンネル数: ' + ypWatcher.channels.length);
                    res.send({
                        portConnectable: true,
                        channels: ypWatcher.channels,
                        ypInfos: ypWatcher.ypInfos
                    });
                },
                () => {
                    res.send({ portConnectable: false });
                }, () => {
                    res.send(500);
                });
        },
        show: (req: express.Request, res: express.Response) => {
            requirePortConnectable(req,
                () => {
                    var id = req.params.channel;
                    var channel = Enumerable.from(ypWatcher.channels)
                        .where(x => x.id === id)
                        .firstOrDefault();
                    if (channel == null) {
                        res.send(404);
                        return;
                    }
                    res.send({
                        portConnectable: true,
                        channel: channel
                    });
                },
                () => {
                    res.send({ portConnectable: false });
                }, () => {
                    res.send(500);
                });
        }
    };
}

function requirePortConnectable(req: express.Request, onConnectable: Function, onUnconnectable: Function, onError: Function) {
    var session: any = req.session;
    if (session.portConnectable) {
        onConnectable();
        return;
    }
    var ip = req.headers['x-forwarded-for'] || req.ip;
    logger.debug(ip + 'のポート開放状況は不明です');
    functions.checkPort(ip, session.port || 7144)
        .then(val => {
            if (val) {
                logger.debug('ポートが開放されていることを確認しました');
                session.portConnectable = true;
                onConnectable();
                return;
            }
            logger.debug('ポートは解放されていません');
            onUnconnectable();
        }).catch((e: any) => {
            logger.debug('ポート開放状況の確認中にエラーが発生しました');
            logger.error(e);
            onError();
        });
}