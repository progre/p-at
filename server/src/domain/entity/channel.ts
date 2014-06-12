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

    clone() {
        return new Channel(
            this.name,
            this.id,
            this.ip,
            this.url,
            this.genre,
            this.desc,
            this.listeners,
            this.relays,
            this.bitrate,
            this.type,
            {
                creator: this.track.creator,
                album: this.track.album,
                title: this.track.title,
                url: this.track.url
            },
            this.uptimeMin,
            this.comment,
            this.direct,
            this.yp,
            this.bandType,
            this.category
        );
    }
}
