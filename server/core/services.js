const { readdirSync } = require('fs')
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const apis = getDirectories(`${__dirname}/../api/`);
var services = {};
var mainServices = {};
for(let key in apis){
    const directoryPath = path.join(__dirname,`/../api/${apis[key]}/services`);
    try{
        fs.readdirSync(directoryPath).forEach(file => {
            var tmp = file.split('.');
            tmp = tmp[0];
            services[tmp] = require(path.join(__dirname,`/../api/${apis[key]}/services/${file}`));
        });
        mainServices[apis[key]] = services;
        services = {};
    }catch(err){
        console.error(chalk.black.bgYellow(' WARN ==> '), `Services not found in ${apis[key]} module`)
        // throw (err);
    }
    
}
framework.services = mainServices;
module.exports = {
    mainServices
}