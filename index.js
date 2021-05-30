const HttpServer = require('./src/modules/http');
const yamlLoader = require('./src/utils/yaml-loader');
const helper = require('./src/utils/helper');
const config = require('./config');
const Logger = require('./src/utils/logger');
const decorator = require('./src/utils/decorator');
const { Random } = require('mockjs');
const fs = require('fs');

// 微服务入口路径
const servicesPath = helper.pathJoin(__dirname, 'services');

const logger = new Logger('Main');
const httpServer = new HttpServer();

/**
 * 适配传入的 server 对象，生成一个适配后的对象
 * 
 * @param {object} app server 实例
 * @returns 
 */
function serverAdapter(app = httpServer) {
  // 如果入参本身就是 httpServer 的实例，则原样返回
  if (app instanceof HttpServer) {
    return app;
  }
  // 如果不是 httpServer 实例，说明 webpack 启动时传入了 app 参数
  // 则将 app 适配到 httpServer
  return {
    route(method, uri, response) {
      if (!config.http.enabledMethods.includes(method)) {
        logger.warn(`request method '${method}' is invalid`);
        return;
      }
      const adApp = { app };
      HttpServer.prototype.route.call(adApp, method, uri, response);
    },
    start() {
      logger.success('Mock server is running...');
    }
  };
}

/**
 * 注册 yaml 路由
 * 
 * @param {object} app server 对象
 * @param {string} yamlPath yaml文件路径
 */
function regYamlRoutes(app, yamlPath) {
  if (!fs.existsSync(yamlPath)) {
    logger.warn(`path '${yamlPath}' is not exist`);
    return;
  }
  const yamls = fs.readdirSync(yamlPath);
  if (!yamls || !yamls.length) return;
  yamls.forEach(el => {
    if (!/\.yaml$/.test(el)) return;
    // 读取 swagger 的 yaml 文档
    const jsonObj = yamlLoader.load(helper.pathJoin(yamlPath, el));
    const requestDefine = yamlLoader.translate(jsonObj, config.http.enabledMethods);
    // 遍历接口，注册路由
    logger.info(`Reg Yaml router from ${el}`);
    requestDefine.forEach(req => {
      if (req.mock && req.mock.response) {
        app.route(req.method, req.uri, decorator(req.mock.response));
        logger.log('Reg router =>', req.method.toUpperCase().bold().cyan(), req.uri);
      }
    });
  });
}

/**
 * 注册 mock 路由
 * 
 * @param {object} app server 对象
 * @param {string} mockFile mock入口文件
 */
function regMockRoutes(app, mockFile) {
  if (!fs.existsSync(mockFile)) {
    logger.warn(`mock handle file '${mockFile}' is not exist`);
    return;
  }
  let handlerRouteDefine = null;
  try {
    handlerRouteDefine = require(mockFile).main(Random, Logger, helper);
  }
  catch (e) {
    logger.error(e.toString());
    return;
  }
  if (!handlerRouteDefine.routes || !handlerRouteDefine.routes.length) {
    logger.warn(`${mockFile} undefine routes`);
    return;
  }
  // 遍历定义，注册路由
  handlerRouteDefine.routes.forEach(el => {
    if (!config.http.enabledMethods.includes(el.method)) {
      logger.warn(`request method '${el.method}' is invalid`);
      return;
    }
    const uri = helper.urlJoin(handlerRouteDefine.basePath, el.uri);
    app.route(el.method, uri, el.response);
    logger.log('Reg router =>', el.method.toUpperCase().bold().cyan(), uri);
  });
}

/**
 * 加载 services 目录下的微服务
 * 
 * @param {object} app express 实例
 * @returns 
 */
function loadServices(app) {
  const services = fs.readdirSync(servicesPath);
  if (!services || !services.length) return;
  // 加载每一个微服务
  services.forEach(el => {
    // yaml
    const yamlHandleFile = helper.pathJoin(servicesPath, el, 'yaml');
    regYamlRoutes(app, yamlHandleFile);
    // mock
    const mockHandleFile = helper.pathJoin(servicesPath, el, 'mock/handle.js');
    regMockRoutes(app, mockHandleFile);
  });
}

/**
 * 启动 mock 服务器
 * 
 * @param {object} app server 实例，可由 webpack 传入
 */
function startMockServer(app = httpServer) {
  const adapterApp = serverAdapter(app);
  loadServices(adapterApp);
  adapterApp.start(config.http.port);
}

module.exports = startMockServer;