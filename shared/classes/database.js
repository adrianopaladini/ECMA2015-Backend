/*jshint esversion: 6 */
const cfenv = require('cfenv');
const Cloudant = require('cloudant');
const fs = require('fs');
const equal = require('deep-equal');
const Config = require('../config/index');
const uuid = require('node-uuid');
const moment = require('moment');

let views = {};

/**
 * @memberof Server
 * @extends Config
 */
class Database extends Config{ //commonJS uses module.exports
  /**
   * @constructs Server.Database
   * @memberof Server.Database
   */
  constructor(){
    super(); //Constructor for the extended class;
  }

  /**
   * Will check if the database exists, if not create it based on the configuration file stored on each feature.
   */
  start(){
    var self = this;
    this.allViews = [];

    return new Promise((resolve, reject)=>{
      this._createDatabase(this.database)
      .then(()=>{
        self.initialize();
        self._fetchModules();

        return Promise.all(self.allViews);
      }).then((result)=>{
        self._insertTestToken(); //just for mocha tests

        resolve({
          name: self.database.name,
          url: self.database.url,
          status: 'Ready'
        });
      }).catch((error)=>{
        reject(error);
        console.log(error); //TODO Better error handler
      });
    });

  }

  /**
   * Based on the database host and name, initialize the database to be used.
   * @return Cloudant database.
   */
  initialize(){
    this.db = Cloudant(this.database.url).use(this.database.name);
  }

  /**
   * Get access directly to the couchDB, allowing the developer to access the cloudant API directly.
   * @return {Cloudant} database The cloudant database module
   */
  getCouchDB() {
    return this.db;
  }

  generateUID(){
    return uuid.v4();
  }

  /**
   * Will execute a simple insert to the cloudant database
   * @param  {Object} doc                           Contains a JSON to be saved into the database
   * @return {promise}                              The result of the insert attempt
   */
  insert(doc){
    var self = this;
    return new Promise((resolve, reject)=>{
      doc.created = moment().format();
      doc.modified = doc.created;

      self.db.insert(doc, self.generateUID(), function(err, body) {
        if(err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }

  /**
   * Will retrieve documents from cloudant database
   * @param   {object} options                    Store several properties used to determine how to proceed the select
   * @param   {string} options.design             The name of the design document from cloudant.
   * @param   {string} options.view               The name of the view from cloundat.
   * @param   {object} [options.query]            Contains properties used on cloudant to filter documents. By default the property 'include_docs' will be true.
   * @param  {boolean} [options.onlyDocs=true]    If you want to filter the result and return only documents or keep the results from cloudant untouched.
   * @return {array}                              Contains the documents returned from cloudant based on the query parameter.
   */
  select(options){
    var self = this;

    return new Promise((resolve, reject) => {
      if (options.query===undefined){
        options.query = {};
      }

      options.query.include_docs = (options.query.include_docs!==undefined) ? options.query.include_docs : true;

      if (options) {
        if (options.design && options.view) {
          var self = this; //keep reference

          self.db.view(options.design, options.view, options.query, function(err, body) {
        		if(err) {
              reject(err);
            } else {
              if (options.onlyDocs===undefined || options.onlyDocs===true ) {
                resolve(self.onlyDocs(body));
              } else {
                resolve(body);
              }
            }
          });
        } else {
          reject(new Error("Missing configuration properties on the 'options'"));
        }
      } else {
        reject(new Error("Missing the 'options' object"));
      }
    });
  }

  /**
   * Will execute a simple update on the cloudant database
   * @param  {Object} doc                           Contains a JSON to be updated on the database
   * @param  {string} doc.id                        The Id of the document to be updated
   * @return {promise}                              The result of the update attempt
   */
  update(doc){
    var self = this;

    return new Promise((resolve, reject)=>{
      doc.modified = moment().format();

      self.db.get(doc._id, {include_docs: true}, function(err, body) {
        if(err) {
          reject(err);
        } else {
          doc._id = body._id;
          doc._rev = body._rev;

          self.db.insert(doc, function(err, body) {
            if(err) {
              reject(err);
            } else {
              resolve(body);
            }
          });
        }
      });
    });
  }

  /**
   * Mark the document as deleted, in case to use force it will remove document from the database.
   * @param  {string} id              The Id of the document to be updated
   * @param {boolean} [force=false]   Determine if the entry will be removed form the database (true) or marked as deleted
   * @return {promise}                The result of the delete attempt
   */
  delete(id, force){
    var self = this;
    return new Promise((resolve, reject) => {
      if(id===undefined || id===null) {
        reject(new Error('MISSING_ID'));
      } else {
        self.db.get(id, {include_docs: true}, function(err, body) {
          if(err) {
            reject(err);
          } else {
            if (force===true) {
              self.db.destroy(body._id, body._rev, function(err, body) {
          			if(err) {
          				reject(err);
          			} else {
          				resolve(body);
          			}
          		});
            } else {
              body.deleted = true;

              //Will update it with the date of the last modification.
              body.modified = moment().format();

              self.db.insert(body, function(err, body) {
                if(err) {
                  reject(err);
                } else {
                  resolve(body);
                }
              });
            }
          }
        });
      }
    });
  }

  /**
   * Execute a bulk acction to the database.
   * @param  {string} entries         Documents to be include / updated into the database
   * @return {promise}                The result of the bulk attempt
   */
  bulk(entries){
    var self = this;

    return new Promise((resolve, reject) => {
      if (Array.isArray(entries) && entries.length > 0){

        //Checks if document has an ID and timestamp properties
        for (let entry of entries){
          entry._id = (!entry._id) ? self.generateUID() : entry._id;
          doc.created = (!doc.created) ? moment().format() : doc.created;
          doc.modified = moment().format();
        }

        db.bulk({docs: entries}, function(err, body) {
          if(err) {
            reject(err);
          } else {
            resolve(body);
          }
        });
      } else {
        reject(err);
      }
    });
  }

  /**
   Check if databse exists, if not create a new database without anything inside;
   * @param {string} database.url   The host used to connect to the database server.
   * @param {string} database.name  The name of the database the application will use.
   * @private
   */
  _createDatabase(database){
    return new Promise((resolve, reject) => {

      Cloudant(database.url).db.create(database.name, function (err) {
        if (err) {
          if (err.error === 'file_exists'){
            resolve('The database already exists. Initializing It.');
          } else {
            reject(err);
          }
        } else {
          resolve('Database created successfully!');
        }
      });
    });
  }

  /**
   * Will retrieve all features (it's directory) inside the folder features.
   * @return                    Provide all features available into the application files.
   * @private
   */
  _fetchModules(){
    var directories = fs.readdirSync('./features/');
    for (let directory of directories){
      if (!directory.includes('.')) { //means is a directory
        this._requireModules('./features/' + directory, directory);
      }
    }
  }

  /**
   * Will retrieve all views (it's files) inside the folder of the feature
   * @param {string} directory  The path to the feature.
   * @param {string} feature    Name of the feature.
   * @return                    Provide all views available into the features/<feature> folder.
   * @private
   */
  _requireModules(directory, feature){
    var files = fs.readdirSync(directory);
    var index = files.indexOf("views");
    if (index > -1) { //has a view folder (instead a view.tbd.js)
      files = fs.readdirSync(directory + "/views");
      for (let file of files){
        this._setModule(file, feature, "/views");
      }
    } else { //has a view.tbd.js file instead a folder
      for (let file of files){
        if (file.startsWith("view.")===true) {
          this._setModule(file, feature);
          break;
        }
      }
    }
  }

  /**
   * Will find the name of the module also will require the module based on it's path.
   * @param {string} file         Name of the file used to set the module.
   * @param {string} feature      Name of the folder of the feature.
   * @param {string} [fromViews]  Determine if the folder 'views' exists inside the feature
   * @return                      The module registered as a middleware to the application.
   * @private
   */
  _setModule(file, feature, fromViews){
    var moduleName;
    if (fromViews===undefined) {
      fromViews = '';
      moduleName = file.split('.')[1]; //the name of the view must be always as this example: view.<view_name>.js
    } else {
      moduleName = file.substring(0, (file.length-3)); //the name of the view must be always as this example: <name_view>.js
    }

    let moduleFilePath = "../../features/" + feature + fromViews + "/" + file.substring(0, (file.length-3)); //removing the '.js'
    views[moduleName] = require(moduleFilePath);
    this.allViews.push(this._prepareViews(moduleName));
  }

  /**
   * Will check if all views created in the features exists into the database;
   * @param {string} designName The name of the design view to be created on the cloundant database.
   * @return                    Promise with the validation of the view into the database.
   * @private
   */
  _prepareViews(designName){
    return new Promise((resolve, reject)=>{
      let self = this;

      this.db.get('_design/' + designName, function(err, designDoc) {
        if (err!==undefined && err!==null) {
          if (err.statusCode !== 404) {
            reject(err);
            return; //I'm against it but in this case was the best solution to keep code readable without use code handlers (variables)
          }
        } else if(equal(designDoc.views, views[designName])) {
          resolve(true);
          return; //I'm against it but in this case was the best solution to keep code readable without use code handlers (variables)
        }

        self._insertDoc(designDoc, designName)
        .then((result)=>{
          resolve(result);
        }).catch((error)=>{
          reject(err);
        });
      });
    });
  }

  /**
   Will create the viwe on the database based on the content of the view.js file.
   * @param     {object} designDoc    Contains the object with the design document returned from cloudant database.
   * @param {designName} designName   The name of the design document to be created.
   * @return                          Promise with the result of the creation of the view on the database.
   * @private
   */
  _insertDoc(designDoc, designName){
    return new Promise((resolve, reject)=>{
      var self = this;

      if(designDoc===undefined || designDoc===null) {
        designDoc = {
          language: 'javascript',
          views: {}
        };
      }

      designDoc.views = views[designName];
      this.db.insert(designDoc, '_design/' + designName, function(err) {
        if(err!==undefined && err!==null) {
          if (err.statusCode === 409) {
            self.db.destroy('_design/' + designName, function(err) {
              if(err) {
                reject(err);
              }

              //recursive call to check the view again and recreate it after the destroy.
              self._prepareViews(designName.split('/')[1])
              .then(resolve())
              .catch((error)=>{ reject(error); });
            });
          } else {
            reject(err);
          }
        } else {
          resolve();
        }
      });

    });
  }

  /**
   * Force the results from cloudant database to be an array of documents (removind other properties from the cloudant results)
   * @param  {Cloudant.Object} body   Contains the result from query into the cloudant database.
   * @return {array}                  Array of documents (objects)
   */
  onlyDocs(body){
    var results = [];

    //These if was added as redundancy, because there will be a body if get no error,
    //but I need to check if rows exists and to avoid errors in the future I'm making
    //sure that body is there and rows too.
    if (body!==undefined && body.rows!==undefined) {
      body = body.rows; //Just to avoid using to much body.rows.

      //This conditional also is for redundancy check, since I expect all results will be an array
      //but just to avoid crashs into the server in production, I put this check in case we not
      //receive what is expected
      if (Array.isArray(body)) {
        if (body.length > 0) {
          for (let row of body){
            results.push(row.doc);
          }
        }
      } else {
        results.push(body.doc);
      }

      return results;
    }
  }

  /**
   * This method will provide a token for bdd tests (if it does not exists)
   */
  _insertTestToken(){
    var self = this;
    if (!process.env.VCAP_SERVICES){
      var doc = {
        type: "SESSION",
        cn: 'BDD - Mocha Test Automation',
        uid: "000000631",
        mail: "bddmocha@xx.ibm.com",
        expiration: moment().add(1, 'years').format(),
        cleanUp: moment().add(1, 'years').format(),
        token: this.tests.token
      };

      let options = {
        design: 'session',
        view: 'getAllSessions',
        query: {keys: [doc.token]}
      };

      this.select(options)
      .then((result) => {
        if (Array.isArray(result) && result.length === 0) {
          self.insert(doc); //is a promise but I dont care when it will be fulfilled.
        }
      });
    }
  }
}

/** @module Server */
module.exports = Database;
