import directives = require('./directives');

export = PlayerCtrler;
var PlayerCtrler = [
    '$scope', '$routeParams', '$cookies', '$http',
    ($scope: any, $routeParams: any, $cookies: any, $http: ng.IHttpService) => {
        // transition中にoverflowを変更するとtransitionが止まる
        $('.dummy').css({
            width: '100%',
            height: '200px'
        });
        $scope.fullscreen = true;

        $scope.localIp = '127.0.0.1:' + ($cookies.localPort || 7144);
        $scope.streamId = $routeParams.streamid;
        $scope.remoteIp = $routeParams.remoteip;
        $('main').click(function (eventObject) {
            if ($scope.fullscreen) {
                directives.fullscreenToWindow($(this).children('.player'));
                $scope.fullscreen = false;
            } else {
                directives.windowToFullscreen($(this).children('.player'));
                $scope.fullscreen = true;
            }
        });

        $http.get('/api/1/channels/' + $routeParams.streamid)
            .then(res => {
                var channel = res.data.channel;
                $scope.name = channel.name;
                var url = getMobileView(channel.url);
                angular.element('aside').append(getThreadViewerElement(url));
            }).catch(reason => {
                console.error(reason);
            });
    }
];

function getThreadViewerElement(url: string) {
    return $('<iframe>')
        .addClass('thread')
        .css({
            height: '100%',
            width: '100%',
            border: 'none'
        })
        .attr('src', url);
}

function getMobileView(url: string) {
    // したらばはliteで表示する
    var shiPattern = 'http://jbbs\\.(?:shitaraba\\.net|livedoor\\.jp)';
    var result: string[];
    result = url.match(new RegExp(shiPattern + '/bbs/read.cgi/(.*)'));
    if (result != null) {
        return 'http://jbbs.shitaraba.net/bbs/lite/read.cgi/' + result[1];
    }
    // 板トップはバグってるので使わない
    //result = url.match(new RegExp(shiPattern + '/(\\w+)/(\\w+)'));
    //if (result != null) {
    //    return 'http://jbbs.shitaraba.net/bbs/lite/subject.cgi/' + result[1] + '/' + result[2] + '/';
    //}
    return url;
}
