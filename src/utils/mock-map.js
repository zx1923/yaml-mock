const { Random } = require("mockjs");

/**
 * 返回枚举数组中某个随机索引对应的值
 * 
 * @param {array} enumbase 枚举值数组
 * @param {any} defaultValue 默认值，非索引
 * @returns 默认值，或枚举值中的任意一个
 */
Random.oneOf = function (enumbase = [], defaultValue = null) {
    if (defaultValue !== null) return defaultValue;
    let i = Random.integer(0, enumbase.length - 1);
    return enumbase[i];
}

module.exports = {
    'string': Random.string.bind(Random),
    'integer': Random.integer.bind(Random),
    'number': Random.float.bind(Random),
    'date': Random.date.bind(Random),
    'boolean': Random.boolean.bind(Random),
    'enum': Random.oneOf.bind(Random),
}