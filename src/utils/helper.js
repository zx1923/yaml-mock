const path = require('path');

module.exports = {
  pathResolve(filepath) {
    return path.resolve(process.cwd(), filepath);
  },

  pathJoin(base, ...args) {
    return path.join(base, ...args);
  },

  urlJoin(base, ...args) {
    return this.pathJoin(base, ...args).replace(/\\+|\/+/g, '/');
  },

  /**
   * 获取数据类型
   * 
   * @param {any} obj 
   * @returns string 
   */
  getTypeOf(obj) {
    let type = Object.prototype.toString.call(obj);
    return type.replace(/\[object\s|\]/g, '');
  },
  /**
   * 是否为对象
   * 
   * @param {any} obj 被检测值
   * @returns true/false
   */
  isObject(obj) {
    return this.getTypeOf(obj) === 'Object';
  },
  /**
   * 通过字段连接成的字符串获取对象的值
   * 
   * @param {object} obj 需要被读取的对象
   * @param {string} keystr 字段连接字符串
   */
  getObjectByKeyStr(obj = {}, keystr = '') {
    if (!keystr) return obj;
    let key = keystr.split('.')[0];
    if (this.isObject(obj[key])) {
      const reg = new RegExp(`^${key}\\.?`);
      const newkey = keystr.replace(reg, '');
      return this.getObjectByKeyStr(obj[key], newkey);
    }
    return obj[key];
  }
}

