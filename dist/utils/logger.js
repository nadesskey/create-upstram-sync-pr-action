var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Logger_prefix;
class Logger {
    constructor(prefix = '') {
        _Logger_prefix.set(this, void 0);
        __classPrivateFieldSet(this, _Logger_prefix, prefix, "f");
    }
    log(...args) {
        console.log(__classPrivateFieldGet(this, _Logger_prefix, "f"), ...args);
    }
    debug(...args) {
        console.debug(__classPrivateFieldGet(this, _Logger_prefix, "f"), ...args);
    }
    info(...args) {
        console.info(__classPrivateFieldGet(this, _Logger_prefix, "f"), ...args);
    }
    warn(...args) {
        console.warn(__classPrivateFieldGet(this, _Logger_prefix, "f"), ...args);
    }
    error(...args) {
        console.error(__classPrivateFieldGet(this, _Logger_prefix, "f"), ...args);
    }
    static use(prefix) {
        let instance = Logger.instances.find(i => __classPrivateFieldGet(i, _Logger_prefix, "f") === prefix);
        if (!instance) {
            instance = new Logger(prefix);
            Logger.instances.push(instance);
        }
        return instance;
    }
}
_Logger_prefix = new WeakMap();
Logger.instances = [];
export default Logger;
