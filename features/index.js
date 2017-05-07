/*jshint esversion: 6 */
const express = require('express');
const fs = require('fs');
const glob = require('glob');

var features = {};

/**
 * @memberof Server
 */
class Router{
  /**
   * Will retrieve all features and register it to the Express Router to be used on the server
   * @param {Express} express     The express module
   * @return {Express.Router}     An object that represents the Router of the express
   */
  constructor(){
    this.router = express.Router();
    this._registerRoutes();
    return this.router;
  }

  /**
   * Will find the route.js file and register it as a module then as a route
   * @return                    Register the route to the Express.Router.
   * @private
   */
  _registerRoutes(){
    const options = {realpath: true};

    glob('./features/**/route.js', options, (er,fileNames) => {
      for(let fileName of fileNames) {
        let route = require(fileName);
        this.router.use(new route());
      }
    });
  }
}

/** @module Server */
module.exports = Router;
