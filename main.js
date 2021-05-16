const HttpServer = require('./src/modules/http');
const yamlLoader = require('./src/utils/yaml-loader');
const helper = require('./src/utils/helper');
const config = require('./config');
const Logger = require('./src/utils/logger');
const decorator = require('./src/utils/decorator');
const { Random } = require('mockjs');

const logger = new Logger('Main');

const httpServer = new HttpServer(config.http.port);

const yamlFile = './services/app/yaml/request.yaml';

// 读取 swagger 的 yaml 文档
const jsonObj = yamlLoader.load(helper.pathResolve(yamlFile));
// 将yaml对象转为request定义
const requestDefine = yamlLoader.translate(jsonObj, config.http.enabledMethods);

// 遍历接口，注册路由
logger.info(`Reg Yaml router from ${yamlFile}`);
requestDefine.forEach(el => {
  if (el.mock && el.mock.response) {
    httpServer.route(el.method, el.uri, decorator(el.mock.response));
    logger.log('Reg router =>', el.method.toUpperCase().bold().cyan(), el.uri);
  }
});

// 加载微服务的handle.js，注册路由，handle.js中的路由会覆盖 yaml 中的路由
const mockHandleFile = './services/app/mock/handle';
const handlerRouteDefine = require(mockHandleFile).main(Random, Logger, helper);
logger.info(`Reg mocked router from ${mockHandleFile}`);
if (!handlerRouteDefine.routes || !handlerRouteDefine.routes.length) {
  throw `${mockHandleFile} undefine routes`;
}

// 遍历定义，注册路由
handlerRouteDefine.routes.forEach(el => {
  const uri = helper.urlJoin(handlerRouteDefine.basePath, el.uri);
  httpServer.route(el.method, uri, el.response);
  logger.log('Reg router =>', el.method.toUpperCase().bold().cyan(), uri);
});

// 启动服务
httpServer.start();
