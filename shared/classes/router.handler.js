/*jshint esversion: 6 */
const express = require('express');

/**
 * @memberof Server
 */
class RouterHandler {
  /**
   * Will Register all routes into the Express.Router
   * @return {Express.Router}            An object that represents the Router of the express
   */
  assignRoutes(routes){
    var router = express.Router();

    for (var route of routes) {
      if (route.interceptor!==undefined){
        router.route(route.url)[route.method](route.interceptor, route.callback);
      } else {
        router.route(route.url)[route.method](route.callback);
      }
    }

    return router;
  }
}

/** @module Server */
module.exports = RouterHandler;
