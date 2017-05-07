/*jshint esversion: 6 */
const moment = require('moment');
const Database = require('../../shared/classes/database');
const Config = require('../../shared/config/index');
const documentType = "SESSION";

/**
 * @memberof Authentication
 * @extends Config
 */
class Model extends Config{
  /**
   * Handle how data will be stored to the database
   */
  constructor(){
    super();
    this.database = new Database();
    this.database.initialize();
  }

  /**
   * Store the user information to the couchDb allowing to keep record of sessions
   * @param  {object} entry Contains the information to be saved
   * @return {object}       The Result of the insertion
   */
  create(entry){
    let currentDate = moment();

    entry.type = documentType;
    entry.expiration = currentDate.add(this.session.loginExpiration, 'hours').format();
    entry.cleanUp = currentDate.add(this.session.sessionExpiration, 'days').format();

    return this.database.insert(entry);
  }

  /**
   * Will retrieve an specific token from the database.
   * @return {object}  The user data saved on cloudant.
   */
  read(token){
    return this.database.select({
      design: 'session',
      view: 'getAllSessions',
      query: (token!==undefined) ? {keys: [token]} : undefined
    });
  }
}

/** @module Authentication */
module.exports = Model;
