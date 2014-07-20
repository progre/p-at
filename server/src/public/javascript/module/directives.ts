declare var Silverlight: any;

var transitionOption = ' 1.25s';

// domにsliverlightプレイヤーを複数置けて、jsのcontrollerインスタンスで操作できる

var ctrler: any;
var streamId: string;
var remoteIp: string;
// .player(.silverlight/.flash)
//   object(silverlight/flash)
export var silverlight = () => ({
    restrict: 'E',
    replace: true,
    template: '<div><div class="dummy" style="' + dummyStyle + '"></div></div>',
    link: (scope: any, element: JQuery, attrs: any) => {
        var chrome = window.navigator.userAgent.indexOf('Chrome') !== -1;

        var fullscreen = false;

        var dummy = element.children('.dummy');
        dummy.css('height', dummy.width() * 3 / 4);

        var sl = getSilverlight(
            chrome,
            attrs.localip,
            c => {
                ctrler = c;
                if (ctrler != null && streamId != null && remoteIp != null) {
                    ctrler.Play(streamId, remoteIp);
                }
//                ctrler.Play(streamId, remoteIp);
            },
            () => element.click(),
            (width, height) => {
                dummy.css('height', dummy.width() * height / width);
                sl.css('height', dummy.width() * height / width);
                // ウィンドウサイズ変更時にプレイヤーウィンドウのサイズを変える
                resize(() => {
                    dummy.css('height', dummy.width() * height / width);
                    sl.css({
                        transition: '',
                        height: dummy.width() * height / width
                    });
                });
            });
        element.append(sl);
        sl.css(getWindowSilverlightStyle(dummy));

        element.click(function (eventObject) {
        });

        // todo: リファクタリング

        attrs.$observe('streamid', function (v:any) {
            streamId = v;
            if (ctrler != null && streamId != null && remoteIp != null) {
                ctrler.Play(streamId, remoteIp);
            }
        });
        attrs.$observe('remoteip', function (v:any) {
            remoteIp = v;
            if (ctrler != null && streamId != null && remoteIp != null) {
                ctrler.Play(streamId, remoteIp);
            }
        });
    }
});

function getSilverlight(chrome: boolean, localIp: string, onLoad: (ctrler: any) => void, onClick: Function, onMediaOpen: (width: number, height: number) => void) {
    return $(Silverlight.createObject(
        '/plugins/wmvplayer.xap',
        null,
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
                ctrler.addEventListener('click', onClick);
                ctrler.addEventListener('mediaOpened', () => onMediaOpen(ctrler.width, ctrler.height));
                ctrler.LocalIp = localIp;
                onLoad(ctrler);
            }
        },
        null, //初期化パラメータ
        null //onLoad イベントに渡される値
        ))
        .css(defaultSilverlightStyle);
}

var dummyStyle = 'width: 100%; background-color: #333;';
var defaultSilverlightStyle = {
    position: 'absolute',
    display: 'block',
    transition: 'top 0.125s, width 0.125s, height 0.125s',

    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 2000
};
// transition中にoverflowを変更するとtransitionが止まる

function getWindowSilverlightStyle(dummy: JQuery) {
    return {
        top: dummy.position().top + 1, // 1pxずれてる
        width: '61.8%',
        height: dummy.height(),
        zIndex: '',// todo: 0.125s適応を遅らせる
        transitionTimingFunction: 'ease-in'
    };
}

var fullscreenSilverlightStyle = {
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 2000,
    transitionTimingFunction: 'ease'
};

export var channelList = () => ({
    restrict: 'E',
    replace: true,
    templateUrl: '/html/list.html'
});

function resize(onResize: Function) {
    var timer: number = null;
    $(window).resize(function () {
        if (timer != null) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => onResize(), 10);
    });
}