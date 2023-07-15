const { readdirSync } = require('fs')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const apis = getDirectories(__dirname + '/../api');

var finalPublicRoutes = [];
var finalProtectedRoutes = [];
var routes = {};
for(let key in apis){
    routes = {};
    routes = require(`../api/${apis[key]}/routes.json`);
    for(let route in routes){
        if(!routes[route].enabled){
            continue
        }
        var controllerArray = routes[route].action.split('.');
        if(controllerArray.length != 2 || !routes[route].action){
            console.log(chalk.black.bgYellow(' WARN ==> '),`There is an problem with MODULE : '${apis[key]}' ROUTE PATH: ${routes[route].path} METHOD: ${routes[route].method}`);
            continue;
        }
        let url = routes[route].path || ''

        if(!routes[route].pathFromRoot){
            routes[route].path = '/'+(apis[key] + (url.startsWith('/') ? url : '/' + url));
        } else {
            routes[route].path = (url.startsWith('/') ? url : '/' + url);
        }

        var controllerName = controllerArray[0];
        var functionName = controllerArray[1];
        var controllerPath = path.join(__dirname, `../api/${apis[key]}/controllers/${controllerName}.js`)
        if(!fs.existsSync(controllerPath)){
            console.log(chalk.black.bgYellow(' WARN ==> '),`There is an problem with MODULE : '${apis[key]}' ACTION: '${controllerPath}' was not found.`);
            continue
        }
        var func = (require(controllerPath))[functionName];
        if(!func){
            console.log(chalk.black.bgYellow(' WARN ==> '),`There is an problem with MODULE : '${apis[key]}' ACTION: '${functionName}' was not found.`);
            continue
        }
        routes[route].action = func;

        // Setting up middlewares
        let middlewares = []
        let middlewareStrings = routes[route].middlewares || []
        if(Array.isArray(middlewareStrings)){
            for(let i = 0; i < middlewareStrings.length; i++){
                let middleware = getMiddleware(middlewareStrings[i], apis[key])
                if(middleware){
                    middlewares.push(middleware)    
                }
            }
        } else if(typeof middlewareStrings == 'string') {
            let middleware = getMiddleware(middlewareStrings, apis[key])
            if(middleware){
                middlewares.push(middleware)
            }
        }
        routes[route].middlewares = middlewares

        // Setting up global middlwares
        let globalMiddlewares = []
        let globalMiddlewareStrings = routes[route].globalMiddlewares || []
        if(Array.isArray(globalMiddlewareStrings)){
            for(let i = 0; i < globalMiddlewareStrings.length; i++){
                let middleware = getMiddleware(globalMiddlewareStrings[i], apis[key], true)
                if(middleware){
                    globalMiddlewares.push(middleware)    
                }
            }
        } else if(typeof globalMiddlewareStrings == 'string') {
            let middleware = getMiddleware(globalMiddlewareStrings, apis[key], true)
            if(middleware){
                globalMiddlewares.push(middleware)
            }
        }
        routes[route].globalMiddlewares = globalMiddlewares



        if(!routes[route].public){
            finalProtectedRoutes.push(routes[route]);
        } else {
            finalPublicRoutes.push(routes[route]);
        }
    }
}
module.exports = {
    public: finalPublicRoutes,
    protected: finalProtectedRoutes 
}

function getMiddleware(middlewareStrings, module, isGlobal = false){
    var middlewareStringArray = middlewareStrings.split('.');
    if(middlewareStringArray.length != 2){
        console.log(chalk.black.bgYellow(' WARN ==> '),`(IGNORED) ${isGlobal ? 'Global' : ''} Middleware is not defined properly in MODULE : '${module}' ROUTE PATH: ${routes[route].path} METHOD: ${routes[route].method}`);
        return false
    } else {
        var [ middlewareFile, functionName ] = middlewareStringArray;
        if(isGlobal){
            var middlewarePath = path.join(__dirname, `../middlewares/${middlewareFile}.js`)
        } else {
            var middlewarePath = path.join(__dirname, `../api/${module}/middlewares/${middlewareFile}.js`)
        }
        
        if(fs.existsSync(middlewarePath)){
            var middlewareFunc = (require(middlewarePath))[functionName];
            if(!middlewareFunc){
                console.log(chalk.black.bgYellow(' WARN ==> '),`(IGNORED) ${isGlobal ? 'Global' : ''} Middleware '${functionName}' not found in '${middlewareFile}.js' middleware file,  MODULE : '${module}'`);
                return false
            } else {
                return middlewareFunc
            }
        } else {
            console.log(chalk.black.bgYellow(' WARN ==> '), `(IGNORED) ${isGlobal ? 'Global' : ''} Middleware file '${middlewareFile}.js' not found at '${middlewarePath}' in MODULE : '${module}'`);
            return false
        }
    }
}