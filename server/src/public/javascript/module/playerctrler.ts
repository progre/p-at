import directives = require('./directives');
import CookieInfrastructure = require('../infrastructure/cookieinfrastructure');
import UserInfoRepos = require('../domain/repos/userinforepos');

export = PlayerCtrler;
var PlayerCtrler = [
    '$scope', '$routeParams', '$cookies', '$http',
    ($scope: any, $routeParams: any, $cookies: any, $http: ng.IHttpService) => {
        var userInfoRepos = new UserInfoRepos(new CookieInfrastructure($cookies));
        var userInfo = userInfoRepos.get();
        $scope.localIp = '127.0.0.1:' + ($cookies.localPort || 7144);

        $http.get('/api/1/search?name=' + $routeParams.name)
            .then(res => {
                var result = <any>res.data;
                if (!result.portConnectable) {
                    return;
                }
                $scope.streamId = result.id;
                $scope.remoteIp = result.ip;
                $scope.type = result.type;

                return $http.get('/api/1/channels/' + $scope.streamId)
            })
            .then(res => {
                var channel = (<any>res.data).channel;
                $scope.name = channel.name;

                // お気に入り
                $scope.favorite = userInfo.favoriteChannels.has(channel.name);
                $scope.addFavorite = () => {
                    userInfo.favoriteChannels.add(channel.name);
                    userInfoRepos.put(userInfo);
                    $scope.favorite = true;
                };
                $scope.removeFavorite = () => {
                    userInfo.favoriteChannels.delete(channel.name);
                    userInfoRepos.put(userInfo);
                    $scope.favorite = false;
                };

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
