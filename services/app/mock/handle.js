
/**
 * 微服务入口函数
 * 
 * @param {object} random mockjs 的 Random 对象
 * @param {object} Logger logger 对象，需实例化
 * @param {object} helper 辅助函数库
 * @returns 
 */
function main(random, Logger, helper) {

  const logger = new Logger('MyTag');
  
  const hello = {
    method: 'get',
    uri: '/hello',
    response: function (req) {
      logger.log(req.route.path);
      return random.sentence();
    }
  }

  return {
    basePath: '/mytag/v1',
    routes: [
      hello,
    ],
  }
}

module.exports = {
  main,
}