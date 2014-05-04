var Promise: PromiseClass = require('es6-promise').Promise;
import http = require('http');
import Enumerable = require('linq');
import log4js = require('log4js');
var logger = log4js.getLogger('server');
import channelsfactory = require('../domain/entity/channelsfactory');
import Channel = require('../domain/entity/channel');

export = YPWatcher;
class YPWatcher {
    channels: Channel[] = [];
    ypInfos: Channel[] = [];

    constructor(private localPort: number) {
    }

    beginWatchYP() {
        this.watchYP();
        setInterval(this.watchYP, 60 * 1000);
    }

    watchYP() {
        var channels = Enumerable.from(<Channel[]>[]);
        var ypInfos = Enumerable.from(<Channel[]>[]);
        var start = Date.now();
        logger.debug('Start TP Request.');
        var self = this;
        Promise.cast()
            .then(() => {
                return get('http://temp.orz.hm/yp/index.txt?port=' + this.localPort);
            })
            .then(body => {
                var list = channelsfactory.fromIndexTxt(body, 'TP');
                channels = channels.concat(list.filter(x => x.name !== 'TPからのお知らせ◆お知らせ'));
                ypInfos = ypInfos.concat(list.filter(x => x.name === 'TPからのお知らせ◆お知らせ'));
                logger.debug('End TP Request. ' + (Date.now() - start) + 'ms, ' + list.length + 'channel(s)');

                start = Date.now();
                logger.debug('Start DP Request.');
                return get('http://dp.prgrssv.net/index.txt');
            })
            .then(body => {
                var list = channelsfactory.fromIndexTxt(body, 'DP');
                channels = channels.concat(list.filter(x => x.name !== 'DP◆お知らせ'));
                ypInfos = ypInfos.concat(list.filter(x => x.name === 'DP◆お知らせ'));
                logger.debug('End DP Request. ' + (Date.now() - start) + 'ms, ' + list.length + 'channel(s)');

                logger.debug('sum is ' + channels.count() + 'channel(s)');
                channels = channels.orderBy(x => x.uptimeMin);// 新しい順に並べる
                self.channels = channels.toArray();
                self.ypInfos = ypInfos.toArray();
            })
            .catch(e => {
                logger.error(e);
            });
    }
}

function get(url: string) {
    return new Promise<string>((resolve, reject) => {
        http.get(url, (res: http.ClientResponse) => {
            var body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk: string) => {
                body += chunk;
            });
            res.on('end', (res: any) => {
                resolve(body);
            });
        });
    });
}