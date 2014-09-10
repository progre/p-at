declare var Silverlight: any;
declare var swfobject: any;

var transitionOption = ' 1.25s';
var dummyStyle = 'width: 100%; background-color: #333;';
var playerStyle = 'position: absolute; display: block;';

// dummyはプラグインを置く領域のサイズを測ったりするのに必要
export var player = () => Player.directive;

class Player {
    static directive = {
        restrict: 'E',
        replace: true,
        template: '<div><div class="_player_dummy" style="' + dummyStyle + '"></div></div>',
        link: (scope: any, element: JQuery, attrs: any) => {
            new Player(element, attrs);
        }
    };

    private plugin: IPlugin;
    private dummy: JQuery;

    constructor(private element: JQuery, private attrs: any) {
        this.dummy = element.children('._player_dummy');
        attrs.$observe('streamid', (v: any) => this.onObserved());
        attrs.$observe('remoteip', (v: any) => this.onObserved());
        attrs.$observe('type', (v: any) => this.onObserved());
        setOnResize(() => this.resize());
        this.resize();
    }

    resize() {
        var pluginLoaded = this.plugin != null;
        var videoWidth = pluginLoaded ? this.plugin.videoWidth() : 4;
        var videoHeight = pluginLoaded ? this.plugin.videoHeight() : 3;
        var width = this.dummy.width();
        var newHeight = width * videoHeight / videoWidth;
        this.dummy.height(newHeight);
        if (pluginLoaded) {
            this.plugin.setSize(width, newHeight);
        }
    }

    private onObserved() {
        if (this.plugin != null || !this.isLoadable())
            return;
        this.plugin = this.createPlugin(this.attrs.type);
        if (this.plugin == null)
            return;
        this.plugin.attach()
            .then(() => {
                this.resize();
            });
    }

    private isLoadable() {
        return !isNullOrEmpty(this.attrs['streamid'])
            && !isNullOrEmpty(this.attrs['remoteip'])
            && !isNullOrEmpty(this.attrs['type']);
    }

    private createPlugin(type: string): IPlugin {
        switch (type) {
            case 'WMV': return new SilverlightPlugin(this.element, this.attrs, this.dummy);
            case 'FLV': return new FlashPlugin(this.element, this.attrs, this.dummy);
        }
    }
}

interface IPlugin {
    attach(): Promise<void>;
    videoWidth(): number;
    videoHeight(): number;
    setSize(width: number, height: number): void;
}

class FlashPlugin implements IPlugin {
    private _videoWidth: number;
    private _videoHeight: number;
    private objectElem: HTMLObjectElement;

    constructor(private element: JQuery, private attrs: any, private dummy: JQuery) {
    }

    attach() {
        var id = '_player_' + Date.now();
        this.element.prepend('<div id="' + id + '">');

        var localIp = this.attrs['localip'];
        var streamId = this.attrs['streamid'];
        var remoteIp = this.attrs['remoteip'];
        var top = this.dummy.position().top + 1;
        return FlashPlugin.embedSWF(id, { localIp: localIp }, streamId, remoteIp, top)
            .then(result => {
                this.objectElem = result.element;
                this._videoWidth = result.width;
                this._videoHeight = result.height;
            });
    }

    videoWidth() {
        return this._videoWidth;
    }

    videoHeight() {
        return this._videoHeight;
    }

    setSize(width: number, height: number) {
        this.objectElem.width = width.toString();
        this.objectElem.height = height.toString();
    }

    private static embedSWF(id: string, flashvars: any, streamId: string, remoteIp: string, top: number): Promise<any> {
        var params = {
            menu: 'false',
            scale: 'noScale',
            allowFullscreen: 'true',
            allowScriptAccess: 'always',
            bgcolor: '',
            wmode: 'direct' // can cause issues with FP settings & webcam
        };
        var attributes = {
            id: id,
            style: playerStyle + ' top: ' + top + 'px'
        };
        var loadedKey = id + '_loaded';
        flashvars['loaded'] = loadedKey;
        var dimensionChangedKey = id + '_dimension_changed';
        flashvars['dimensionChanged'] = dimensionChangedKey;
        return new Promise((resolve, reject) => {
            (<any>window)[loadedKey] = () => {
                var objectElement = (<any>window)[id] || (<any>document)[id];
                objectElement.play(streamId, remoteIp);
            };
            (<any>window)[dimensionChangedKey] = function (width: number, height: number) {
                var objectElement = (<any>window)[id] || (<any>document)[id];
                resolve({ element: objectElement, width: width, height: height });
            };
            swfobject.embedSWF(
                '/plugin/flvplayer.swf',
                id, '100%', '0', '10.0.0',
                '/plugin/expressInstall.swf',
                flashvars, params, attributes);
        });
    }
}

class SilverlightPlugin implements IPlugin {
    private static defaultSilverlightStyle = {
        position: 'absolute',
        display: 'block',
        transition: 'top 0.125s, width 0.125s, height 0.125s',

        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 2000
    };

    private _videoWidth: number;
    private _videoHeight: number;
    private silverlight: JQuery;
    private ctrler: any;
    private streamId: string;
    private remoteIp: string;

    constructor(private element: JQuery, private attrs: any, private dummy: JQuery) {
    }

    attach() {
        return new Promise<void>((resolve, reject) => {
            var chrome = window.navigator.userAgent.indexOf('Chrome') !== -1;
            console.log(this.attrs.localip);
            this.silverlight = SilverlightPlugin.getSilverlight(
                chrome,
                this.attrs.localip,
                ctrler => {
                    ctrler.Play(this.attrs.streamid, this.attrs.remoteip);
                },
                () => this.element.click(),
                (width, height) => {
                    this._videoWidth = width;
                    this._videoHeight = height;
                    resolve();
                });
            this.element.append(this.silverlight);
            this.silverlight.css(this.getWindowSilverlightStyle(this.dummy));
        });
    }

    videoWidth() {
        return this._videoWidth;
    }

    videoHeight() {
        return this._videoHeight;
    }

    setSize(width: number, height: number) {
        this.silverlight.css({
            transition: '',
            height: height
        });
    }

    private getWindowSilverlightStyle(dummy: JQuery) {
        return {
            top: dummy.position().top + 1, // 1pxずれてる
            width: '61.8%',
            height: dummy.height(),
            zIndex: '',// todo: 0.125s適応を遅らせる
            transitionTimingFunction: 'ease-in'
        };
    }

    private static getSilverlight(chrome: boolean, localIp: string, onLoad: (ctrler: any) => void, onClick: Function, onMediaOpen: (width: number, height: number) => void) {
        return $(Silverlight.createObject(
            '/plugin/wmvplayer.xap',
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
            .css(this.defaultSilverlightStyle);
    }
}

export var channelList = () => ({
    restrict: 'E',
    replace: true,
    templateUrl: '/html/list.html'
});

function setOnResize(onResize: Function) {
    var timer: number = null;
    $(window).resize(function () {
        if (timer != null) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => onResize(), 10);
    });
}

function isNullOrEmpty(str: string) {
    return str == null || str === '';
}