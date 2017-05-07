/*jshint esversion: 6 */

/////////////////////////////////////////////////////////////////////////////////////////////
// Is important to warn that this class won't have this available since it's not initiated //
// it is stored in the memory to be called when RESTful is executed.                       //
/////////////////////////////////////////////////////////////////////////////////////////////
const Utils = require('./services/utils');
const Model = require('./model');

/**
 * @memberof Authentication
 */
class Controller{
  /**
   * Handle all events related with the feature authentication
   */
  constructor(){}

  /**
   * [POST] Authenticate user on the bluepages
   * @param {Express.Request} req Handle the Request from the frontend
   * @param {Express.Response} res Handle the Response from the backend
   * @return The user logged into the application.
   */
  authenticate(req, res){
    let model = new Model();
    let utils = new Utils();

    req.user.token = utils.getToken(); //Assign a token to this user

    model.create(req.user)
    .then((result)=>{
      res.status(200).json(req.user.token);
    }).catch((error)=>{
      res.status(400).json(error);
    });
  }

  getUserInfo(req, res){
    let model = new Model();

    model.read(req.query.token)
    .then((result)=>{
      res.status(200).json(result);
    }).catch((error)=>{
      res.status(400).json(error);
    });
  }
}

/** @module Authentication */
module.exports = Controller;
