const datetime = require('silly-datetime');
const chalk = require('chalk');
const config = require('../../config');
const helper = require('../utils/helper');

const levelConfig = config.log.level || '*';
const STRING_USE = ['bold', 'red', 'redBright', 'cyan', 'grey', 'yellow', 'green', 'blue', 'bgBlack', 'bgWhite', 'bgBlue', 'bgCyan', 'bgGray', 'bgGreen', 'bgRed', 'bgYellow'];

STRING_USE.forEach(el => {
  String.prototype[el] = function () {
    return chalk[el](this);
  }
});

const LOG_MAP = {
  log: 'cyan',
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  success: 'green',
};

/**
 * 获取当前时分字符串
 * @returns 当前的时分字符串，附带毫秒
 */
function strNow(format = 'HH:mm:ss') {
  const now = new Date();
  let mil = '000' + (now % 1000);
  return datetime.format(now, format) + `.${mil.substring(mil.length - 3)}`;
}

/**
 * 日志类型等级是否有效
 * 
 * @param {string} levelType 日志类型
 */
function isLevelValid(levelType) {
  if (levelConfig === '*') {
    return true;
  }
  if (helper.getTypeOf(levelConfig) === 'Array' && levelConfig.includes(levelType)) {
    return true;
  }
  return false;
}

function Logger(tag) {
  this.tag = tag;

  this._log = function (type, ...msgs) {
    if (!isLevelValid(type)) return;
    const color = LOG_MAP[type];
    console.log(chalk[color](`[${strNow()}]`), chalk[color](this.tag), ...msgs);
  }
}

Logger.prototype.log = function (...msgs) {
  this._log('log', ...msgs);
  // console.log(chalk.cyan(`[${strNow()}]`), chalk.cyanBright(this.tag), ...msgs);
}

Logger.prototype.error = function (...msgs) {
  msgs.map((el, idx) => {
    msgs[idx] = chalk.red(el);
  });
  this._log('error', ...msgs);
  // console.log(chalk.red(`[${strNow()}]`), chalk.redBright(this.tag), ...msgs);
}

Logger.prototype.warn = function (...msgs) {
  this._log('warn', ...msgs);
  // console.log(chalk.yellow(`[${strNow()}]`), chalk.yellowBright(this.tag), ...msgs);
}

Logger.prototype.info = function (...msgs) {
  this._log('info', ...msgs);
  // console.log(chalk.blue(`[${strNow()}]`), chalk.blueBright(this.tag), ...msgs);
}

Logger.prototype.success = function (...msgs) {
  this._log('success', ...msgs);
  // console.log(chalk.green(`[${strNow()}]`), chalk.greenBright(this.tag), ...msgs);
}

module.exports = Logger;