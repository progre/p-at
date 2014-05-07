export = CookieInfrastructure;
class CookieInfrastructure {
    constructor(private $cookie: any) {
    }

    getSet(key: string) {
        return toSet(this.$cookie[key]);
    }

    put(key: string, value: Set<string>): void;
    put(key: string, value: any) {
        if (value instanceof Set) {
            value = toString(value);
        }
        this.$cookie[key] = value;
    }
}

function toString(set: Set<string>) {
    var list: string[] = [];
    set.forEach(item => {
        list.push(item);
    });
    return JSON.stringify(list);
}

function toSet(cookie: string) {
    var set = new Set<string>();
    var list: string[];
    try {
        list = JSON.parse(cookie);
    } catch (e) {
        list = [];
    }
    list.forEach(item => {
        set.add(item);
    });
    return set;
}