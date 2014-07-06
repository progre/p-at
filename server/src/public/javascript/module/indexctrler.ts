import Enumerable = require('linqjs');
import CookieInfrastructure = require('../infrastructure/cookieinfrastructure');
import UserInfoRepos = require('../domain/repos/userinforepos');
import UserInfo = require('../domain/entity/userinfo');

export = IndexCtrler;
var IndexCtrler = [
    '$scope', '$http', '$cookies',
    ($scope: any, $http: ng.IHttpService, $cookies: any) => {
        var userInfoRepos = new UserInfoRepos(new CookieInfrastructure($cookies));
        var userInfo = userInfoRepos.get();

        $http.get('/api/1/channels')
            .then(response => {
                var data: any = response.data;
                $scope.portConnectable = data.portConnectable;
                $scope.channels = Enumerable.from(<any[]>data.channels)
                    .select(x => addPropertiesForView(x, userInfo))
                    .orderBy(x => x.favorite ? 1 : 2)
                    .toArray();
                $scope.ypInfos = data.ypInfos.map((x: any) => addPropertiesForView(x, userInfo));
                $scope.events = data.events.map((x: any) => addPropertiesForView(x, userInfo));
            })
            .catch(reason => {
                console.error(reason);
            });
    }
];

function addPropertiesForView(x: any, userInfo: UserInfo) {
    x.line1 = x.name;
    if (x.genre === '' && x.desc === '') {
        x.line2 = '';
    } else {
        var line = [x.genre, x.desc]
            .filter(x => x.length > 0)
            .join(' - ');
        x.line2 = '[' + line + ']';
    }
    x.line3 = x.comment;
    x.favorite = userInfo.favoriteChannels.has(x.name);
    return x;
}