/*jshint esversion: 6 */

const bodyParser = require('body-parser');
const Application = require('./shared/classes/application');

const serverParams = {
  port: 3000,
  appPath: __dirname + '/client',
  middlewareList: [
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json()
  ]
};

new Application(serverParams).start();

exports.forTests = function(){
  return process.env.URL;
};
