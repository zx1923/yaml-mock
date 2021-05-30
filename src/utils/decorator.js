const Logger = require('./logger');
const mockMap = require('./mock-map');
const { Random } = require("mockjs");

const logger = new Logger('Mock');

/**
 * 获取根类型的mock数据
 * 
 * @param {object} repdefine 根返回值定义 {type: string|number|boolean...}
 * @returns 
 */
function _mockResponse(repdefine = {}) {
  if (!repdefine.type) {
    return mockMap.string();
  }
  // 如果有默认值，直接返回默认值
  if (repdefine.default) {
    return repdefine.default;
  }
  // 处理枚举类型
  if (repdefine.enum) {
    return mockMap.enum(repdefine.enum);
  }
  // 其他类型
  return mockMap[repdefine.type]();
}

/**
 * 将返回值重新包装成 mock 对象
 * 
 * @param {object} response 返回值定义
 */
function _responseDecorator(response = {}) {
  // 按对象类型返回
  if ('object' === response.type) {
    let repobj = {};
    for (let key in response.include) {
      repobj[key] = _responseDecorator(response.include[key]);
    }
    return repobj;
  }
  else if ('array' === response.type) {
    let times = Random.integer(1, 5);
    let resarr = [];
    while (times--) {
      resarr.push(_responseDecorator(response.include));
    }
    return resarr;
  }
  // 按普通类型返回
  else {
    return _mockResponse(response);
  }
}

/**
 * 将返回对象重新包装成 mock 函数
 * 
 * @param {object} response 响应定义
 * @returns 返回一个闭包函数，每次请求时调用闭包函数实现数据mock
 */
function decorator(response = {}) {
  return function () {
    return _responseDecorator(response);
  }
}

module.exports = decorator;