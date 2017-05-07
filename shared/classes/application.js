/*jshint esversion: 6 */
const express = require('express');
const cfenv = require('cfenv');
const Routes = require('./../../features/index');
const Database = require('./database');

/**
 * @memberof Server
 * @extends Database
 */
class Application extends Database{ //commonJS uses module.exports
  /**
   * Will raise the server based on the configuration object.
   * @param {object} options                          Store several params to initilize the server.
   * @param {string} options.appPath                  Store the path of the frontend. Tells the server where to serve.
   * @param {array} [options.middlewareList]          Contains all middleware used to be included on the server before it starts.
   * @param {string} [options.port=cfenv.port]        Port to be applied if do not locate the bluemix port variable
   * @return {Express.Application}  An object that represents the express server
   */
  constructor(options){
    super();
    let bluemix = {variables: cfenv.getAppEnv()};

    //overwrite the port with bluemix content in case the server get hosted there.
    options.port = (options.port!==undefined && process.env.PORT===undefined) ? options.port : bluemix.variables.port;

    this.app = express();
    this.port = (process.env.PORT!==undefined) ? bluemix.variables.port : options.port ;
    this.name = bluemix.variables.name;
    this.url = (bluemix.variables.urls[0].startsWith("http://localhost")===true) ? "http://localhost:" + this.port : bluemix.variables.urls[0];

    //add middlewares to the server
    this.addMiddleware(options.middlewareList);

    //Register all features of the application;
    this.app.use('/api', new Routes());

    //Serve the frontend
    if (options.appPath!==undefined && options.appPath!==null) {
      this.app.use('/', express.static(options.appPath));
    }

    this._setRootFolder(options); //based on the frontend client folder

    //serve the swagger files and the jsdoc
    this.app.use('/documentation/swagger/', express.static(this.root + '/features/swagger/'));
    this.app.use('/documentation/jsdoc/', express.static(this.root + '/jsdoc/'));

    process.env.URL = this.url;
  }

  /**
   * Will add midlewares to the express server
   * @param {array} middlewareList  Contains all middleware used to be included on the server before it starts.
   */
  addMiddleware(middlewareList){
    if (middlewareList!== undefined){
      if (Array.isArray(middlewareList)) {
        if (middlewareList.length > 0) {
          for (var middleware of middlewareList) {
            this.app.use(middleware);
          }
        }
      } else {
        this.app.use(middlewareList);
      }
    }
  }

  /**
   * Raise the server and prints the status to the terminal
   */
  start(){
    var self = this;
    return new Promise((resolve, reject)=>{
      self.server = self.app.listen(self.port, () => {
        let application = {
          name: self.name,
          url: self.url,
          status: 'Live'
        };

        super.start()
        .then((database)=>{
          var result = {
            application: application,
            database: database
          };

          self._printServerInfo(result);
          resolve(result);
        }).catch((error)=>{
          reject(error);
        });

        });

    });
  }

  /**
   * Will close the connection with server
   */
  terminate(){
    self.server.close();
  }

  /**
   * Used to provide a print with the app information to the console.
   * @private
   */
  _printServerInfo(data){ //Just to make things more beautiful when printing it.
    let times = 64;
    let marker = ('/');
    let emptySpace = (' ');

    console.log(marker.repeat(times));
    console.log('// SERVER INFORMATION' + emptySpace.repeat((times-2)-('// SERVER INFORMATION').length) + '//');
    for (let type in data) {
      console.log('//  ' + type.toUpperCase() + emptySpace.repeat((times-2)-('//  ' + type).length) + '//');
      console.log('//    Name:   ' + data[type].name  + emptySpace.repeat((times-2)-('//    Name:   ' + data[type].name).length) + '//');
      console.log('//    Url:    ' + data[type].url  + emptySpace.repeat((times-2)-('//    Url:    ' + data[type].url).length) + '//');
      console.log('//    Status: ' + data[type].status  + emptySpace.repeat((times-2)-('//    Status: ' + data[type].status).length) + '//');
    }
    console.log(marker.repeat(times));
  }

  /**
   * Store the root folder into the application class
   * @param The configuration object to start the server
   * @private
   */
  _setRootFolder(options){
    let root = options.appPath.split('/');
    root.pop();
    this.root = root.join('/');
  }
}

/** @module Server */
module.exports = Application;
