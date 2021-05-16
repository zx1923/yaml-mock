const datetime = require('silly-datetime');
const chalk = require('chalk');

const STRING_USE = ['bold', 'red', 'redBright', 'cyan', 'grey', 'yellow', 'green', 'blue', 'bgBlack', 'bgWhite', 'bgBlue', 'bgCyan', 'bgGray', 'bgGreen', 'bgRed', 'bgYellow'];

STRING_USE.forEach(el => {
    String.prototype[el] = function () {
        return chalk[el](this);
    }
});

/**
 * 获取当前时分字符串
 * @returns 当前的时分字符串，附带毫秒
 */
function strNow(format = 'HH:mm') {
    const now = new Date();
    let mil = '000' + (now % 1000);
    return datetime.format(now, format) + `.${mil.substring(mil.length - 3)}`; 
}

function Logger(tag) {
    this.tag = tag;
}

Logger.prototype.log = function (...msgs) {
    console.log(chalk.cyan(`[${strNow()}]`), chalk.cyanBright(this.tag), ...msgs);
}

Logger.prototype.error = function (...msgs) {
    msgs.map((el, idx) => {
        msgs[idx] = chalk.red(el);
    });
    console.log(chalk.red(`[${strNow()}]`), chalk.redBright(this.tag), ...msgs);
}

Logger.prototype.warn = function (...msgs) {
    console.log(chalk.yellow(`[${strNow()}]`), chalk.yellowBright(this.tag), ...msgs);
}

Logger.prototype.info = function (...msgs) {
    console.log(chalk.blue(`[${strNow()}]`), chalk.blueBright(this.tag), ...msgs);
}

Logger.prototype.success = function (...msgs) {
    console.log(chalk.green(`[${strNow()}]`), chalk.greenBright(this.tag), ...msgs);
}

module.exports = Logger;