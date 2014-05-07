import CookieInfrastructure = require('../../infrastructure/cookieinfrastructure');
import UserInfo = require('../entity/userinfo');

export = UserInfoRepos;
class UserInfoRepos {
    constructor(private cookieIs: CookieInfrastructure) {
    }

    get() {
        // ログインしていればセッションから、していなければクッキーから取得する
        // ログイン実装してないけどな！
        return new UserInfo(this.cookieIs.getSet('favoriteChannels'));
    }

    put(value: UserInfo) {
        this.cookieIs.put('favoriteChannels', value.favoriteChannels);
    }
}
