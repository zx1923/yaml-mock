const Yaml = require('yamljs');
const fs = require("fs");
const path = require('path');
const Logger = require('./logger');
const helper = require('./helper');

const logger = new Logger('Yaml');

/**
 * 解析当前的 schema 对象
 * 
 * @param {object} schema schema对象
 * @param {object} yamlobj yaml对象
 * @returns 
 */
function _parseYamlSchema(schema, yamlobj = {}) {
    // 未定义 type,直接定义 $ref 引用
    if (schema['$ref']) {
        let keystr = schema['$ref'].replace(/^#\//, '');
        keystr = keystr.replace(/\//, '.');
        let rep = helper.getObjectByKeyStr(yamlobj, keystr);
        if (!rep.properties) {
            logger.error(`Yaml 文件错误，schema 的 properties 未定义`);
            return null;
        }
        return _parseProperties(rep.properties, yamlobj);
        // return {
        //     type: 'object',
        //     include: _parseProperties(rep.properties, yamlobj),
        // };
    }
    // 定义了 type: array
    if (schema.type && schema.type === 'array' || schema.items) {
        return {
            type: schema.type,
            include: _parseYamlSchema(schema.items, yamlobj),
        };
    }
}

function _parseProperties(properties, yamlobj = {}) {
    for (let key in properties) {
        try {
            delete properties[key].description;
        }
        catch (e) {}
        // 默认判断了 properties 下会有 schema
        if (properties[key].schema) {
            properties[key] = _parseYamlSchema(properties[key].schema, yamlobj);
        }
        // properties 下可能会有 properties
        if (properties[key].properties) {
            // properties[key] = {
            //     type: 'object',
            //     include: _parseProperties(properties[key].properties, yamlobj),
            // };
            properties[key] = _parseProperties(properties[key].properties, yamlobj);
        }
    }
    return {
        type: 'object',
        include: properties,
    };
}

function _createResponseSuccess(resobj = {}, yamlobj = {}) {
    // 定义了 properties, 则直接取 properties 
    if (resobj.properties) {
        return _parseProperties(resobj.properties, yamlobj);
        // return {
        //     type: 'object',
        //     include: _parseProperties(resobj.properties, yamlobj),
        // };
    }
    // 默认定义了 schema, 直接取 schema 的定义
    if (resobj.schema) {
        return _parseYamlSchema(resobj.schema, yamlobj);
    }
    // 定义了 content, 没有直接定义 schema, 则遍历 content, 取 schema 的值
    if (resobj.content) {
        for (let ct in resobj.content) {
            if (resobj.content[ct].schema) {
                return _createResponseSuccess(resobj.content[ct], yamlobj);
            }
        }
    }
}

function _createRequestDefine (typeinfo = {}, yamlobj = {}) {
    // 如果存在请求参数定义，则处理了请求参数
    let reqdef = {};
    if (typeinfo.parameters && typeinfo.parameters.length) {
        // TODO: 处理请求参数定义
    }
    if (typeinfo.responses && typeinfo.responses['200']) {
        reqdef.response = _createResponseSuccess(typeinfo.responses['200'], yamlobj);
    }
    return reqdef;
}

/**
 * 将 yaml 对象转换成请求定义
 * 
 * @param {object} yamlobj yaml 对象
 * @param {*} enabledMethods 支持的 HTTP 请求类型
 * @returns 
 */
function translate(yamlobj = {}, enabledMethods = []) {
    const basePath = yamlobj.basePath || '';
    const paths = yamlobj.paths;

    let routes = [];
    for (let uri in paths) {
        let reqObj = yamlobj.paths[uri];
        enabledMethods.forEach(type => {
            if (!reqObj[type]) return;
            // 拼装 URL => get:/user-order/v1/api/to/path
            // const reguri = `${type}:${helper.urlJoin(basePath, uri)}`;
            const reguri = `${helper.urlJoin(basePath, uri)}`;
            const regtype = reqObj[type];
            // logger.log(reguri)
            routes.push({
                method: type,
                uri: reguri,
                mock: _createRequestDefine(regtype, yamlobj)
            });
        });
    }
    return routes;
} 

/**
 * 从给定文件路局读取yaml文件，并解析为json对象
 * 
 * @param {string} filepath 文件路径
 * @returns yaml转json的对象
 */
function load(filepath = '') {
    if (!filepath || !fs.existsSync(filepath)) {
        logger.error("文件名为空，或文件不存在");
        return;
    }
    if (!/.+\.yaml$/g.test(filepath)) {
        logger.error("目标不是 yaml 文件");
        return;
    }
    try {
        return Yaml.parse(fs.readFileSync(filepath).toString());
    }
    catch (err) {
        logger.error(`文件 ${filepath} 解析失败`, err.toString());
    }
    return;
}

/**
 * 读取并解析给定目录下所有yaml文件
 * @param {string} basepath 批量读取的文件路径
 * @returns 路径下所有yaml文件的解析结果
 */
function batchLoad(basepath = '') {
    if (!basepath) {
        logger.error("给定的路径为空");
        return;
    }
    const results = fs.readdirSync(basepath);
    let yamls = [];
    results.forEach(file => {
        if (!/.+\.yaml$/g.test(file)) return;
        yamls.push(load(path.join(basepath, file)));
    });
    return yamls;
}

module.exports = {
    load,
    batchLoad,
    translate,
};