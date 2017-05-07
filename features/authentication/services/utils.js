/*jshint esversion: 6 */
const Config = require('../../../shared/config/index');
const Model = require('../model');
const uuid = require('node-uuid');
const moment = require('moment');

/**
 * @memberof Authentication
 * @extends Config
 */
class Utils extends Config{
  /**
   * Common routines used by the authenticate feature
   */
  constructor(){
    super();
  }

  /**
   * Will generate a random token to the user
   * @return {string}  A random string encrypted with base64
   */
  getToken(){
    var token = uuid.v4() + "-" + uuid.v4();

    return token.toString('base64');
  }

  /**
   * Validate the user token from the frontend into the cloudant database.
   * @param {array} roles                         Specify the roles allowed to access the route.
   * @param {Express.Request} req.header.token    Expect the Request.header to have the token of the user on it.
   * @return {boolean}                            If the token is valid, return true.
   */
  isAuthorized(roles){
    let model = new Model();

    return (req, res, next)=>{
      model.read(req.query.token)
      .then((session)=>{
        if (Array.isArray(session) && session.length > 0) {
          session = session[0];

          let isAllowed = false;
          if (roles!==undefined){
            if (Array.isArray(session.role) && session.role>0){
              for (let role of session.role){
                if (roles.indexOf(session.role) > 1) {
                  isAllowed = true;
                }
              }
            } else {
              if (roles.indexOf(session.role) > 1) {
                isAllowed = true;
              }
            }
          } else {
            isAllowed = true;
          }

          //setting dates to validate if token is expired.
          let dates = {
            current: moment(),
            LoginExpiration: moment(session.expiration)
          };

          //Checks if the login stills up.
          if (dates.LoginExpiration.diff(dates.current) <= 0){
            res.status(400).send('Session Timeout. Your login is expired');
          } else {
            if (isAllowed) {
              next();
            } else {
              res.status(400).send("You're not authorized to perform that operation.");
            }
          }
        } else {
          res.status(400).send('Session Not found. Please Login');
        }
      }).catch((error)=>{
        res.status(400).json(error);
      });
    };


  }
}

/** @module Authentication */
module.exports = Utils;
