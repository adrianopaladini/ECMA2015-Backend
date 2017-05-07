/*jshint esversion: 6 */
const express = require('express');
const Controller = require('./controller');
const RouterHandler = require('../../shared/classes/router.handler');
const Authentication = {
  Utils: require('../authentication/services/utils')
};

/**
 * @memberof Example
 */
class Route extends RouterHandler {
  /**
   * Will register all routes for each method related with this feature
   * @param {Express.Router} router   The Router inside the express
   * @return {Express.Router}         An object that represents the Router of the express
   */
  constructor(){
    super();

    var controller = new Controller();
    var utils = new Authentication.Utils();

    /**
     * @namespace routes
     * @memberof Authentication.Authenticate
     * @property {array}     (Anonnymous)                      - An array with an object inside. See the properties of this object below:
     * @property {string}    (Anonnymous).url                  - Path to LDAP authentication server
     * @property {string}    (Anonnymous).method               - Organization and place to lookup
     * @property {Function}  [(Anonnymous).interceptor]        - Holds the function that will intercept the access to the API
     * @property {Function}  (Anonnymous).callback             - Holds the function that will be executed after the interceptor
     */
    const routes = [
      {url: '/example', method: 'post', interceptor: utils.isAuthorized(), callback: controller.create},
      {url: '/example', method: 'get', interceptor: utils.isAuthorized(), callback: controller.read},
      {url: '/example', method: 'put', interceptor: utils.isAuthorized(), callback: controller.update},
      {url: '/example', method: 'delete', interceptor: utils.isAuthorized(), callback: controller.delete},
      {url: '/example/custom', method: 'get', interceptor: utils.isAuthorized(), callback: controller.customQuery},
      {url: '/example/controlled', method: 'get', interceptor: utils.isAuthorized(['ADMIN']), callback: controller.read}
    ];

    return this.assignRoutes(routes);
  }
}

/** @module Example */
module.exports = Route;
