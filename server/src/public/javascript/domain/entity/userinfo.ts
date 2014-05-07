export = UserInfo;
class UserInfo {
    constructor(
        public favoriteChannels = new Set<string>()) {
    }
}