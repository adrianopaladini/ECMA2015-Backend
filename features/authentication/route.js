/*jshint esversion: 6 */
const express = require('express');
const Controller = require('./controller');
const services = {
  LDAP: require('./services/ldap')
};

/**
 * @memberof Authentication
 */
class Route{
  /**
   * Will register all routes for each method related with this feature
   * @param {Express.Router} router   The Router inside the express
   * @return {Express.Router}         An object that represents the Router of the express
   */
  constructor(){
    var ldapService = new services.LDAP();
    var controller = new Controller();

    /**
     * @namespace routes
     * @memberof Authentication.Route
     * @property {array}     (Anonnymous)                      - An array with an object inside. See the properties of this object below:
     * @property {string}    (Anonnymous).url                  - Path to LDAP authentication server
     * @property {string}    (Anonnymous).method               - Organization and place to lookup
     * @property {Function}  [(Anonnymous).interceptor]        - Holds the function that will intercept the access to the API
     * @property {Function}  (Anonnymous).callback             - Holds the function that will be executed after the interceptor
     */
    this.routes = [
      {url: '/authenticate', method: 'post', interceptor: ldapService.authenticate, callback: controller.authenticate}
    ];

    return this._registerRoutes();
  }

  /**
   * Will Register all routes into the Express.Router
   * @param  {Express.Router} router     The Router inside the express
   * @return {Express.Router}            An object that represents the Router of the express
   * @private
   */
  _registerRoutes(){
    var router = express.Router();

    for (var route of this.routes) {
      if (route.interceptor!==undefined){
        router.route(route.url)[route.method](route.interceptor, route.callback);
      } else {
        router.route(route.url)[route.method](route.callback);
      }
    }

    return router;
  }
}

/** @module Authentication */
module.exports = Route;
