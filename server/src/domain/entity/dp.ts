import channelsfactory = require('./channelsfactory');
import Channel = require('./channel');

var osirase = 'DP◆お知らせ';

export function url() {
    return 'http://dp.prgrssv.net/index.txt';
}

export function getChannels(body: string) {
    var list = channelsfactory.fromIndexTxt(body, 'DP');
    return [
        list.where(x => x.name !== osirase).toArray(),
        list.where(x => x.name === osirase).toArray()
    ];
}
