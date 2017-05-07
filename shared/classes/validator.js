/*jshint esversion: 6 */
const Joi = require('joi');
const fs = require('fs');

/**
 * @memberof Server
 */
class Validator{
  /**
   * Validates the data using the Joi module to ensure the data from frontend.
   */
  constructor(feature){
    this.feature = feature;
  }

  /**
   * Will validate the object based on the schema
   * @param  {object} entry           Document to be validated
   * @param  {object} schema          Schema used to validate the object
   * @param  {object} [entry=false]   Determine if the Joi will validates the entire array to throw an error(false), or will stop at first validation message(true).
   * @return {object}                 The result of the validation.
   */
  verify(entry, schemaPath, abortEarly){
    return new Promise((resolve, reject)=>{
      var self = this; //keep reference.

      abortEarly = (abortEarly===undefined) ? false : abortEarly;

      Joi.validate(entry, this._getSchema(schemaPath), {abortEarly: abortEarly}, (err, value) => {
        if (err) {
          reject(self._format(err));
        } else {
          resolve(entry);
        }
      });
    });
  }


  /**
   * Will format the result from Joi.validate to a readable error message
   * @param {object} errors     Contains the results from the Joi.validate
   * @private
   */
  _format(errors){
    if (errors.details!==undefined) {
      let results = [];

      if (Array.isArray(errors.details) && errors.details.length>0){
        let result;
        for (let error of errors.details){
          result = {
            field: error.path,
            message: error.message
          };

          results.push(result);
        }
      } else {
        results.push({
          field: errors.details.path,
          message: errors.details.message
        });
      }

      return results;
    }
  }

  /**
   * Will retrieve the schema based on the path of the feature
   * @param {string} schemaPath Path to a different schema file
   * @private
   */
  _getSchema(schemaPath){
    if (schemaPath!==undefined){
      this.feature = schemaPath;
    } else {
      this.feature += "/schema.js";
    }

    /**
     * @namespace mainSchema
     * @memberof Server.Validator
     * @property {string}  				[mainSchema._id]						Unique Id from cloudant
     * @property {string}  				[mainSchema._rev]				  Revision key of the document
     * @property {string}  			  [mainSchema.type]				    Type of the document
     * @property {boolean}  	    [mainSchema.deleted]        If document is deleted
     * @property {string}  		    [mainSchema.created]        Date the document was created
     * @property {string}  		    [mainSchema.modified]       Date the document was modified
     */
    let mainSchema = { //This is the default schema (all documents should or should not have these properties)
      _id: Joi.string().optional(),
			_rev: Joi.string().optional(),
			type: Joi.string().optional(),
			deleted: Joi.boolean().optional(),
			created: Joi.string().optional(),
			modified: Joi.string().optional()
    };

    //getting the schema from the feature.
    var featureSchema = require(this.feature);
    var schema = new featureSchema().getSchema();

    //incrementing the main schema with properties from feature schema
    if (schema!==undefined){
      for (let property in schema) {
        mainSchema[property] = schema[property];
      }
    }

    return Joi.object().keys(mainSchema);
  }

  /**
   * Will ensure all params from the frontend are included on the request
   * @param {object} params Several params sent by the frontend through the request
   * @param {array} [optional] An array with list of optional params
   */
  ensureParams(params, optional){
    return new Promise((resolve, reject)=>{
      let result = {
        type: 'params',
        params: [],
        error: false
      };

      for (let param in params){
        if (optional) {
          if (optional.indexOf(param) === -1) {//means required
            if (!params[param]) {
              result.params.push(param);
            }
          }
        } else {
          if (!params[param]) {
            result.params.push(param);
          }
        }
      }

      if (result.params.length >= 1) {
        result.error = true;
        reject(result);
      } else {
        resolve(params);
      }
    });
  }
}

/** @module Server */
module.exports = Validator;
