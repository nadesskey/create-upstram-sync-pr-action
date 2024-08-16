export default class Logger {
  static instances: Logger[] = [];
  #prefix: string;

  constructor(prefix = '') {
    this.#prefix = prefix;
  }

  log(...args: any[]) {
    console.log(this.#prefix, ...args);
  }

  debug(...args: any[]) {
    console.debug(this.#prefix, ...args);
  }

  info(...args: any[]) {
    console.info(this.#prefix, ...args);
  }

  warn(...args: any[]) {
    console.warn(this.#prefix, ...args);
  }

  error(...args: any[]) {
    console.error(this.#prefix, ...args);
  }

  static use(prefix: string) {
    let instance = Logger.instances.find(i => i.#prefix === prefix);
    if (!instance) {
      instance = new Logger(prefix);
      Logger.instances.push(instance);
    }
    return instance;
  }
}