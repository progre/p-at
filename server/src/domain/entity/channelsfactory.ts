import Enumerable = require('linq');
import Channel = require('./channel');

export function fromIndexTxt(body: string, yp: string) {
    var list = Enumerable.from(body.split('\n'))
        .where(line => line.length > 0)
        .select(line => line.split('<>'))
        .select(entries => new Channel(
            entries[0],
            entries[1],
            entries[2],
            entries[3],
            entries[4],
            entries[5],
            parseInt(entries[6], 10),
            parseInt(entries[7], 10),
            parseInt(entries[8], 10),
            entries[9],
            {
                creator: entries[10],
                album: entries[11],
                title: entries[12],
                url: entries[13],
            },
            hoursMinToMin(entries[15]),
            entries[17],
            entries[18] === '1',
            yp));
    switch (yp) {
        case 'TP':
            list = list
                .where(x => x.name !== 'TPからのお知らせ◆お知らせ')
            // Free, Open, Over, 3Mbps Overを取り出す。descからは削除
                .select(channel => {
                    var r = channel.desc.match(/(?: - )?&lt;(.*)&gt;$/);
                    if (r == null) {
                        channel.bandType = '';
                        return channel;
                    }
                    channel.bandType = r[1];
                    channel.desc = channel.desc.substring(0, (<any>r).index);
                    return channel;
                });
        case 'DP':
            list = list
                .where(x => x.name !== 'DP◆お知らせ');
        default:
            break;
    }
    return list.toArray();
}

function hoursMinToMin(hmm: string) {
    var nums = hmm.split(':').map(x=> parseInt(x, 10));
    return nums[0] * 60 + nums[1];
}