declare var Silverlight: any;

var transitionOption = ' 1.25s';

// .player(.silverlight/.flash)
//   object(silverlight/flash)
export var silverlight = () => ({
    restrict: 'C',
    link: (scope: any, element: JQuery, attrs: any) => {
        var chrome = window.navigator.userAgent.indexOf('Chrome') !== -1;

        element.css({
            top: 0,
            width: '100%',
            height: '100%'
        });
        Silverlight.createObject(
            '/plugins/wmvplayer.xap',
            element[0],
            Date.now().toString(),// 一意な文字列
            {
                width: '100%',
                height: '100%',
                background: '#000',
                version: '5.0',
                windowless: chrome ? 'true' : 'false'// chromeはtrueじゃないとiframeとの重なりが上手く描画されない
            },
            {
                onError: () => console.error('Error on Silverlight'),
                onLoad: (sl: any, args: any) => {
                    var ctrler = sl.Content.Controller;
                    ctrler.addEventListener('click', () => element.click());
                    ctrler.LocalIp = attrs.localip;
                    ctrler.Play(attrs.streamid, attrs.remoteip);
                }
            },
            null, //初期化パラメータ
            null //onLoad イベントに渡される値
            );
    }
});

export function fullscreenToWindow(player: JQuery) {
    var ctrler = (<any>$('.player object')[0]).Content.Controller;
    // player.width():?=ctrler.width:ctrler.height
    var newWidth = document.documentElement.clientWidth * 0.618;
    var newHeight = newWidth * (ctrler.height || 2) / (ctrler.width || 3);
    player.css({
        top: $('.dummy').position().top + 1, // 1pxずれてる
        width: newWidth,
        height: newHeight
    });
    $('.dummy').css({
        width: newWidth,
        height: newHeight
    });
    console.log('window');
}

export function windowToFullscreen(player: JQuery) {
    player.css({
        top: 0,
        width: '100%',
        height: '100%'
    });
    console.log('fullscreen');
}