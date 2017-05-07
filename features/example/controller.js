/*jshint esversion: 6 */

/////////////////////////////////////////////////////////////////////////////////////////////
// Is important to warn that this class won't have this available since it's not initiated //
// it is stored in the memory to be called when RESTful is executed.                       //
/////////////////////////////////////////////////////////////////////////////////////////////
const Model = require('./model');
const Validator = require('../../shared/classes/validator');
const fs = require('fs');
const feature = __dirname; //must be like this.

/**
 * @memberof Example
 */
class Controller{
  /**
   * Handle all events related with the feature authentication
   */
  constructor(){}

  /**
   * [POST] An example about a insertion of a model
   * @param {Express.Request} req Handle the Request from the frontend
   * @param {Express.Response} res Handle the Response from the backend
   * @return An object with the result of the insertion into the database.
   */
  create(req, res){
    let model = new Model();
    let validator = new Validator(feature);

    validator.verify(req.body)
    .then(function(body){

      return model.create(body);
    }).then((result)=>{

      res.status(200).json(result);
    }).catch((error)=>{

      res.status(400).json(error);
    });
  }


  /**
   * [GET] An example about how to retrieve an array of entries from the database
   * @param {Express.Request} req Handle the Request from the frontend
   * @param {Express.Response} res Handle the Response from the backend
   * @return {array}  An array with all entries from a table
   */
  read(req, res){
    let model = new Model();

    model.read(req.query.uid)
    .then((result)=>{
      res.status(200).json(result);
    }).catch((error)=>{
      res.status(400).json(error);
    });
  }

  /**
   * [PUT] An example how to update an specifc entry on the database
   * @param {Express.Request} req Handle the Request from the frontend
   * @param {Express.Response} res Handle the Response from the backend
   * @return {object}  The result of the attempt to update an entry
   */
  update(req, res){
    let model = new Model();
    let validator = new Validator(feature);

    validator.verify(req.body)
    .then(function(body){

      return model.read(req.query.uid);
    }).then((body)=>{
      if (Array.isArray(body) && body.length > 0) {
        return model.update(body[0]);
      } else {
        throw new Error('Document Not Found');
      }

    }).then((result)=>{

      res.status(200).json(result);
    }).catch((error)=>{

      res.status(400).json(error);
    });
  }

  /**
   * [DELETE] An example how to mark an entry as deleted an entry in the database
   * @param {Express.Request} req Handle the Request from the frontend
   * @param {Express.Response} res Handle the Response from the backend
   * @return {object}  The result of the attempt to delete an entry
   */
  delete(req, res){
    let model = new Model();

    if (req.query.uid!==undefined) {
      model.read(req.query.uid)
      .then((body)=>{
        var force = (req.query.force && req.query.force==='true') ? true : undefined;

        if (Array.isArray(body) && body.length > 0) {
          return model.delete(body[0]._id, force);
        } else {
          throw new Error('Document Not Found');
        }
      }).then((result)=>{

        res.status(200).json(result);
      }).catch((error)=>{

        res.status(400).json(error);
      });
    } else {
      res.status(400).send("Missing parameters");
    }
  }

  /**
   * [PUT] An example how to create a custom method from the cloudant database.
   * @param {Express.Request} req Handle the Request from the frontend
   * @param {Express.Response} res Handle the Response from the backend
   * @return {object}  The result of custom method.
   */
  customQuery(req, res){
    let model = new Model();

    model.custom()
    .then((result)=>{
      res.status(200).json(result);
    }).catch((error)=>{
      res.status(400).json(error);
    });
  }
}

/** @module Example */
module.exports = Controller;
