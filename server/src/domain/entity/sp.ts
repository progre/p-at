import channelsfactory = require('./channelsfactory');
import Channel = require('./channel');

var osirase = /^SP ※お知らせ/;
var upload = 'SP◆アップロード帯域';
var portDenied = 'SP◆ポート未開放';

export function url(localPort: number) {
    return 'http://bayonet.ddo.jp/sp/index.txt?port=' + localPort;
}

export function getChannels(body: string) {
    var list = channelsfactory.fromIndexTxt(body, 'TP')
    // Free, Open, Over, 3Mbps Overを取り出す。descからは削除
        .select(channel => {
            var r = channel.desc.match(/(?: - )<(.*)>$/);
            if (r == null) {
                channel.bandType = '';
                return channel;
            }
            channel.bandType = r[1];
            channel.desc = channel.desc.substring(0, (<any>r).index);
            return channel;
        })
        .where(x => x.name !== upload && x.name !== portDenied);

    return [
        list.where(x => !osirase.test(x.name)).toArray(),
        list.where(x => osirase.test(x.name)).toArray()
    ];
}
