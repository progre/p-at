var Promise: PromiseClass = require('es6-promise').Promise;
import http = require('http');
import Enumerable = require('linq');
import log4js = require('log4js');
var logger = log4js.getLogger('server');
import channelsfactory = require('../domain/entity/channelsfactory');
import Channel = require('../domain/entity/channel');
import tp = require('../domain/entity/tp');
import sp = require('../domain/entity/sp');
import dp = require('../domain/entity/dp');
import ep = require('../domain/entity/ep');

export = YPWatcher;
class YPWatcher {
    channels: Channel[] = [];
    ypInfos: Channel[] = [];
    events: Channel[] = [];

    constructor(private localPort: number) {
    }

    beginWatchYP() {
        this.watchYP();
        setInterval(() => this.watchYP(), 60 * 1000);
    }

    watchYP() {
        var channels = Enumerable.from(<Channel[]>[]);
        var ypInfos = Enumerable.from(<Channel[]>[]);
        var events = Enumerable.from(<Channel[]>[]);
        var start: number;
        Promise.cast()
            .then(() => {
                logger.debug('Start TP Request.');
                start = Date.now();
                return get(tp.url(this.localPort));
            })
            .then(body => {
                var time = Date.now() - start;
                var result = tp.getChannels(body);
                channels = channels.concat(result[0]);
                ypInfos = ypInfos.concat(result[1]);
                logger.debug('End TP Request. ' + time + 'ms, ' + result[0].length + ' channel(s), ' + result[1].length + ' info(s)');

            //     logger.debug('Start SP Request.');
            //     start = Date.now();
            //     return get(sp.url(this.localPort));
            // })
            // .then(body => {
            //     var time = Date.now() - start;
            //     var result = sp.getChannels(body);
            //     channels = channels.concat(result[0]);
            //     ypInfos = ypInfos.concat(result[1]);
            //     logger.debug('End SP Request. ' + time + 'ms, ' + result[0].length + ' channel(s), ' + result[1].length + ' info(s)');

                logger.debug('Start DP Request.');
                start = Date.now();
                return get(dp.url());
            })
            .then(body => {
                var time = Date.now() - start;
                var result = dp.getChannels(body);
                channels = channels.concat(result[0]);
                ypInfos = ypInfos.concat(result[1]);
                logger.debug('End DP Request. ' + time + 'ms, ' + result[0].length + ' channel(s), ' + result[1].length + ' info(s)');

                logger.debug('Start EP Request.');
                start = Date.now();
                return get(ep.url());
            })
            .then(body => {
                var time = Date.now() - start;
                var result = ep.getChannels(body);
                ypInfos = ypInfos.concat(result[1]);
                events = events.concat(result[2]);
                logger.debug('End EP Request. ' + time + 'ms, ' + result[0].length + ' channel(s), ' + result[1].length + ' info(s)');

                logger.debug('sum is ' + channels.count() + 'channel(s)');
                channels = channels.orderBy(x => x.uptimeMin);// 新しい順に並べる
                this.channels = channels.toArray();
                this.ypInfos = ypInfos.toArray();
                this.events = events.toArray();
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
