/*jshint esversion: 6 */
const cfenv = require('cfenv');

/** * @memberof Server */
class Config{
  /**
   * Sets the properties that stores all config used on the application
   */
  constructor(){
    let appEnv = cfenv.getAppEnv();

    /**
     * @namespace database
     * @memberof Server.Config
     * @property {string}  database.credentials                   - Store the credentials from bluemix.
     * @property {string}  database.name=ecma_example             - Store the name of the database. Defaults applies for raise the server locally.
     * @property {string}  database.url=http://127.0.0.1:5984     - Store the path to reach the database. Defaults applies for raise the server locally.
     */
    var credentials = appEnv.getServiceCreds(this._getServiceName('cloudantNoSQLDB Dedicated'));

    this.database = {
      name: (process.env.database) ? process.env.database : "ecma_example",
    	url: (process.env.VCAP_SERVICES) ? credentials.url : 'http://127.0.0.1:5984'
    };

    /**
     * @namespace session
     * @memberof Server.Config
     * @property {string} session.authString=Characters      - Path to LDAP authentication server.
     * @property {integer} session.loginExpiration=13        - Determine the hours until login expires.
     * @property {integer} session.sessionExpiration=30      - Determine the days until the session record on blumix get removed.
     */
    this.session = {
      loginExpiration: 13, //hours
      sessionExpiration: 30 //days
    };

    /**
     * @namespace tests
     * @memberof Server.Config
     * @property {string} tests.token=11acd7d9-MOCHA-BDD-472ceaf6e544      - Token to be used to perform BDD tests (locally)
     */
    this.tests = {
      token: "11acd7d9-MOCHA-BDD-472ceaf6e544"
    };

  }

  /**
   * Will check for the name of the module on bluemix environment variables
   * @param {string} serviceName  The name known about service (most used locally)
   * @return {string}             The name of the services
   * @private
   */
  _getServiceName(serviceName){
    if (process.env.VCAP_SERVICES){
      return JSON.parse(process.env.VCAP_SERVICES)[serviceName][0].name;
    } else {
      return serviceName;
    }
  }
}

/** @module Server */
module.exports = Config;
