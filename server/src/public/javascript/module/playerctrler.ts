import directives = require('./directives');

export = PlayerCtrler;
var PlayerCtrler = [
    '$scope', '$routeParams', '$cookies', '$http',
    ($scope: any, $routeParams: any, $cookies: any, $http: ng.IHttpService) => {
        $scope.localIp = '127.0.0.1:' + ($cookies.localPort || 7144);
        $scope.streamId = $routeParams.streamid;
        $scope.remoteIp = $routeParams.remoteip;

        // お気に入り
        $scope.favorite = false;
        $scope.addFavorite = () => {
            $scope.favorite = true;
        };
        $scope.removeFavorite = () => {
            $scope.favorite = false;
        };

        $http.get('/api/1/channels/' + $routeParams.streamid)
            .then(res => {
                var channel = res.data.channel;
                $scope.name = channel.name;
                var url = getMobileView(channel.url);
                angular.element('aside').append(getThreadViewerElement(url));// iframeを読み込み時に仕込んでおくとヒストリを汚してしまう為、動的に追加する
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
