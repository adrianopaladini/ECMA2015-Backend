/*jshint esversion: 6 */
const moment = require('moment');
var Database = require('../../shared/classes/database');
const documentType = "EXAMPLE";

/**
 * @memberof Example
 */
class Model{
  /**
   * Handle how data will be stored to the database
   */
  constructor(){
    this.database = new Database();
    this.database.initialize();
  }

  /**
   * Insert an entry to the database
   * @param  {object} entry     Contains the information to be saved
   * @return {object}           The Result of the insertion
   */
  create(entry){
    entry.type = documentType;

    return this.database.insert(entry);
  }

  /**
   * Will retrieve an specific key from the database.
   * @param {string} [key]    A key to the document to be returned
   * @return {object}         The data saved on cloudant.
   */
  read(key){
    return this.database.select({
      design: 'exampleA',
      view: 'getAllDocs',
      query: (key!==undefined) ? {keys: [key]} : undefined
    });
  }

  /**
   * Update an specific entry on the database
   * @param  {object} entry     Contains the information to be saved
   * @return {object}           The Result of the update
   */
  update(entry){
    return this.database.update(entry);
  }

  /**
   * Update an specific entry on the database
   * @param  {string} id             The unique identification of an object
   * @param {bollean} force          Determine if the entry will be removed from the database (true) or marked as deleted
   * @return {object}                The Result of the attempt of the delete method
   */
  delete(id, force){
    return this.database.delete(id, force);
  }

  /**
   * Will retrieve all deleted documents by executing a custom query
   */
  custom(){
    var db = this.database;

    return new Promise((resolve, reject)=>{
      var cloudant = db.getCouchDB();

      cloudant.view('exampleB', 'getAllDeletedDocs', {include_docs: true}, function(err, body) {
        if(err) {
          reject(err);
        } else {
          resolve(db.onlyDocs(body));
        }
      });
    });
  }
}

/** @module Example */
module.exports = Model;
