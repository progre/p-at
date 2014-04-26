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

    constructor(private localPort: number) {
    }

    beginWatchYP() {
        this.watchYP();
        setInterval(this.watchYP, 60 * 1000);
    }

    watchYP() {
        var list = Enumerable.from(<Channel[]>[]);
        var start = Date.now();
        logger.debug('Start TP Request.');
        Promise.cast()
            .then(() => {
                return get('http://temp.orz.hm/yp/index.txt?port=' + this.localPort);
            })
            .then(body => {
                var channels = channelsfactory.fromIndexTxt(body, 'TP');
                list = list.concat(channels);
                logger.debug('End TP Request. ' + (Date.now() - start) + 'ms, ' + channels.length + 'channel(s)');

                start = Date.now();
                logger.debug('Start DP Request.');
                return get('http://dp.prgrssv.net/index.txt');
            })
            .then(body => {
                var channels = channelsfactory.fromIndexTxt(body, 'DP');
                list = list.concat(channels);
                logger.debug('End DP Request. ' + (Date.now() - start) + 'ms, ' + channels.length + 'channel(s)');

                logger.debug('sum is ' + list.count() + 'channel(s)');
                this.channels = list.toArray();
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