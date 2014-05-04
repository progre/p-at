import channelsfactory = require('./channelsfactory');
import Channel = require('./channel');

export function url() {
    return 'http://eventyp.xrea.jp/index.txt';
}

export function getChannels(body: string) {
    return [[], [], channelsfactory.fromIndexTxt(body, 'EP').toArray()];
}
