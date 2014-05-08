export = Channel;
class Channel {
    constructor(
        public name = '',
        public id = '00000000000000000000000000000000',
        public ip = '0.0.0.0',
        public url = '',
        public genre = '',
        public desc = '',
        public listeners = 0,
        public relays = 0,
        public bitrate = 0,
        public type = 'UNKNOWN',
        public track = {
            creator: '',
            album: '',
            title: '',
            url: ''
        },
        public uptimeMin = 0,
        public comment = '',
        public direct = false,
        public yp = '',
        public bandType = '',
        public category = '') {
    }
}
