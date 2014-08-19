var Promise: PromiseClass = require('es6-promise').Promise;
import http = require('http');
import express = require('express');
import log4js = require('log4js');

var logger = log4js.getLogger('server');

export function requirePortConnectable(req: express.Request, onConnectable: Function, onUnconnectable: Function, onError: Function) {
    var session: any = (<any>req).session;
    if (session.portConnectable) {
        onConnectable();
        return;
    }
    var ip = req.headers['x-forwarded-for'] || req.ip;
    var port = session.port || 7146;
    logger.debug(ip + ':' + port + 'のポート開放状況は不明です');
    checkPort(ip, port)
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

function checkPort(ip: string, port: number) {
    return new Promise<boolean>((resolve, reject) => {
        http.get('http://' + ip + ':' + port,
            () => {
                resolve(true);
            }).on('error', () => {
                resolve(false);
            });
    });
}
