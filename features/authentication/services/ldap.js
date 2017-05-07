/*jshint esversion: 6 */
const passport = require('passport');
const ldapStrategy = require('passport-ldapauth');
const Utils = require('./utils');
const Config = require('../../../shared/config/index');
const uuid = require('node-uuid');

/**
 * @memberof Authentication
 * @extends Config
 */
class LDAP extends Config{
  /**
   * Will initialize the passport module with the LDAP strategy
   * @return {passport}  Passport module initialized
   */
  constructor(){
    super();

    /**
     * @namespace ldap
     * @memberof Authentication.LDAP
     * @property {object}  server                                       - Options used on LDAP strategy.
     * @property {string}  server.url=ldaps://DOMAIN.com:1234     - Path to LDAP authentication server
     * @property {string}  server.searchBase=ou=bluepages,o=ibm.com     - Organization and place to lookup
     * @property {string}  server.searchFilter=(mail={{username}})      - Define the property to match in the search
     * @property {array}  server.searchAttributes=cn,uid,mail         - Attributes to be returned from LDAP
     */
    this.ldap = {
      server: {
        url: 'ldaps://DOMAIN.com:1234',
        searchBase: 'ou=search,o=domain.com',
        searchFilter: '(mail={{username}})',
        searchAttributes: [
          'cn',
          'uid',
          'mail'
        ]
      }
    };

    passport.use(new ldapStrategy(this.ldap));
    passport.initialize();
  }

  /**
   * Will authenticate on ldap using the passport module
   * @param {Express.Request} req         Handle the Request from the frontend
   * @param {Express.Response} res        Handle the Response from the backend
   * @param {Express.NextFunction} next   Sends the objects (req and res) to the next callback
   * @return Adds an object to the Request object
   */
  authenticate(req, res, next){
    passport.authenticate('ldapauth', {session: false}, function(err, user, info) {
      if (err) {
        return res.status(400).json({success:false, message:'authentication failed', details: err});
      }
      if (!user) {
        return res.status(400).json({success:false, message:'authentication failed', details: info});
      } else {
        if (Array.isArray(user.cn) && user.cn.length > 0) {
          user.cn = user.cn[0];
        }
      }
      var utils = new Utils();

      //Remove unused properties
      if (user.controls) {delete user.controls;}
      if (user.dn) {delete user.dn;}

      req.user = user; //pass the result from LDAP to the next function through the Express.Request
      next(); //calls the next function
    })(req, res, next);
  }
}

/** @module Authentication */
module.exports = LDAP;
