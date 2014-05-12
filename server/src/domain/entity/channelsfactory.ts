import Enumerable = require('linq');
import Channel = require('./channel');

export function fromIndexTxt(body: string, yp: string) {
    return Enumerable.from(body.split('\n'))
        .where(line => line.length > 0)
        .select(line => line.split('<>'))
        .select(entries => entries.map(unparseSpecialLetter))
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
            yp,
            '',
            getCategory(entries[4], entries[5])));
}

function hoursMinToMin(hmm: string) {
    var nums = hmm.split(':').map(x=> parseInt(x, 10));
    return nums[0] * 60 + nums[1];
}

function unparseSpecialLetter(str: string) {
    return str.replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#039;/g, '\'')
        .replace(/&amp;/g, '&');
}

function getCategory(genre: string, desc: string) {
    var filters = [
        { category: 'Adult', regex: /18x|x18|r-18|18禁/i },
        { category: 'Creating', regex: /お絵かき|oekaki|模型/i },
        { category: 'Shogi', regex: /将棋/i },
        { category: 'Engineering', regex: /プログラミング|programming|開発|電子工作/i },
        { category: 'Slot', regex: /slot/i },
        { category: 'Talk', regex: /雑談/i },
        { category: 'Game/TA', regex: /(^|\W|\d)R?TA/ },
        { category: 'Game/MMO', regex: /mmo|diablo/i },
        { category: 'Game/FPS', regex: /fps/i },
        { category: 'Game/RPG', regex: /rpg|ff|dq|ドラクエ|ドラゴンクエスト|ポケモン/i },
        { category: 'Game/Social', regex: /social|艦これ|パズドラ|モバマス/i },
    ];
    var filters2 = [
        { category: 'Game/Other', regex: /game|ゲーム|ps/i }
    ];
    for (var i = 0, len = filters.length; i < len; i++) {
        var filter = filters[i];
        if (filter.regex.test(genre)) {
            return filter.category;
        }
    }
    for (var i = 0, len = filters.length; i < len; i++) {
        var filter = filters[i];
        if (filter.regex.test(desc)) {
            return filter.category;
        }
    }
    for (var i = 0, len = filters2.length; i < len; i++) {
        var filter = filters2[i];
        if (filter.regex.test(genre)) {
            return filter.category;
        }
    }
    for (var i = 0, len = filters2.length; i < len; i++) {
        var filter = filters2[i];
        if (filter.regex.test(desc)) {
            return filter.category;
        }
    }
    return 'Other';
}