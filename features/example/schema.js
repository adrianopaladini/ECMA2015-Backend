/*jshint esversion: 6 */
const Joi = require('joi');

/**
 * @memberof Example
 */
class Schema {

	/**
	 * Will create a static property to store the schema definition of this feature.
	 */
	constructor(){
		/**
     * @namespace schema
     * @memberof Example.Schema
     * @property {number}  				schema.age						Age
     * @property {string}  				[schema.name]				Name
     * @property {boolean}  			schema.married				Yes (true) | No (false)
     * @property {string|null}  	schema.gender        (Male | Female | null)
     * @property {string(9)}  		schema.uid           Unique ID
     */
		this.schema = {
			age: Joi.number().required(),
			name: Joi.string().optional(),
			married: Joi.boolean().required(),
			gender: Joi.string().optional(),
			uid: Joi.string().required().max(9)
		};
	}

	getSchema(){
		return this.schema;
	}
}

/** * module Example */
module.exports = Schema;
