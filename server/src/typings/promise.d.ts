declare class Promise<T> {
    static cast<T>(obj?: T): Promise<T>;
    static resolve(obj: any): Promise<any>;
    static reject(obj: any): Promise<any>;
    static all(array: any[]): any;
    static race(array: any[]): any;

    constructor(func: (resolve: (aValue?: T) => void, reject: (aReason?: any) => void) => void);

    then<U>(onFulfilled: (val: T) => Promise<Promise<U>>, onRejected?: Function): Promise<U>;
    then<U>(onFulfilled: (val: T) => Promise<U>, onRejected?: Function): Promise<U>;
    then<U>(onFulfilled: (val: T) => U, onRejected?: Function): Promise<U>;
    catch(onRejected: (reason?: Error) => void): any;
}

interface PromiseClass {
    cast<T>(obj?: T): Promise<T>;
    resolve(obj: any): Promise<any>;
    reject(obj: any): Promise<any>;
    all(array: any[]): any;
    race(array: any[]): any;

    new <T>(func: (resolve: (aValue?: T) => void, reject: (aReason?: any) => void) => void): Promise<T>;
}