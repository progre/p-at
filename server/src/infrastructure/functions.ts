var Promise = <new <T>(func: (resolve: (aValue?: T) => void, reject: (aReason?: any) => void) => void) => Promise<T>>require('es6-promise').Promise;
import http = require('http');

export function checkPort(ip: string, port: number) {
    return new Promise<boolean>((resolve, reject) => {
        http.get('http://' + ip + ':' + port,
            () => {
                resolve(true);
            }).on('error', () => {
                resolve(false);
            });
    });
}
