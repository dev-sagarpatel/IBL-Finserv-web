/* For migrations */
const path = require('path');
var Umzug = require('umzug');
let rootPath = path.resolve(__dirname, '../');
const connection = require('../core/connection');
var umzug = new Umzug({
  storage: 'sequelize',
    storageOptions: {
        sequelize: connection // here should be a sequelize instance, not the Sequelize module
    },
  migrations: {
      // The params that gets passed to the migrations.
      // Might be an array or a synchronous function which returns an array.
      params: [connection.getQueryInterface(), connection.constructor, function() {
        throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
      }],
      path: path.join(rootPath, 'db/migrations/')
  }
});

umzug.pending().then(function (migrations) {
  if(migrations.length > 0){
      umzug.up().then(function()  {
        console.log('Migration complete!');
        // framework.connection.sync()
        // .then(() => {
        // })
        // .catch(e => {
        //   console.error('MODEL SYNC ERROR: ',e)
        // })
      }).catch(err => {
        console.error(err)
        // throw `Unable to perform migration due to ${err}`;
      });
  }
});

module.exports = umzug; 