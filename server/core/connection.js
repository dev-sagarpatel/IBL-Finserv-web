const Sequelize = require('sequelize');
const fs = require('fs')
const moment = require('moment')
var config = require('../config/database.json');
config = config[process.env.NODE_ENV];

if(!config){
    throw "Invalid Database Configuration";
}

let replica = config.useReplica
if(!replica){
  config = {...config.write, dialect: config.dialect}
}


const logger = (...msg) => {
    if(config.fileLogs == undefined ? config.write.fileLogs : config.fileLogs){
      fs.appendFileSync('db-logs.txt', moment().format('DD-MM-YYYY HH:mm:ss : ') + msg[0]+'\n');
    }
    if(config.consoleLogs == undefined ? config.write.consoleLogs : config.consoleLogs){
      console.log(moment().format('DD-MM-YYYY HH:mm:ss : '), msg[0]);
    }
}

const setSqlModeQuery = "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));";

let dbOptions = {
  host: config.host || '',
  dialect: config.dialect,
  logging: (config.logging == undefined ? config.write.logging : config.logging)  ? logger : false,
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  },
  define: {
      freezeTableName: true
  },
  dialectOptions: {
      // dateStrings: true,
      typeCast: function (field, next) { // for reading from database
        if (field.type === 'DATETIME') {
          const dateTime = field.string()
          return dateTime
        }
          return next()
        },
    },
    // timezone: '+05:30'
}

if(replica){
  dbOptions.replication = {
    read: config.read,
    write: config.write
  }
}

const sequelize = new Sequelize((replica ? null : config.database), (replica ? null : config.username), (replica ? null : config.password), dbOptions);

  sequelize
  .authenticate()
  .then(async () => {
      console.log("Connection has been established successfully. ")
      await sequelize.query(setSqlModeQuery);
      console.log('SQL mode is set successfully.');
  })
  .catch(err => {
    throw `Unable to connect to the database: ${err}`
  });

  framework = {connection : sequelize};

//   let maxPacketLimit = 10000000000000000000
//   framework.connection.query('set global max_allowed_packet=?', { replacements: [maxPacketLimit] })
//     .then(([res, meta]) => {
//         console.log('max_allowed_packet is set to ', maxPacketLimit)
//     })
//     .catch(error => {
//         console.log(error);
//     })

  module.exports = sequelize;
