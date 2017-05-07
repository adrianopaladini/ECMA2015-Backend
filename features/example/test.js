/*jshint esversion: 6 */
var assert = require('assert');
const request = require('request');
const Config = require('../../shared/config/index');

/**
 * @memberof Example
 * @extends Config
 */
class Test extends Config{
  /** * Will initiate an object of type Test */
  constructor(url){
    super();
    this.auth = '?token=' + this.tests.token;
    this.route = '/example';
  }

  /**
   * Will execute several tests to the API
   * @param {string} url The url of the Application
   * @return             The results of the tests to the mocha
   */
  execute(url){
    var object;
    var methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

    for (let method of methods){
      if (method!=='constructor' && method!=='execute' && typeof this[method] === 'function'){
        this[method](url);
      }
    }
  }

  /**
   * Will perform tests aiming one part of the API: POST /api/example
   * @param {string} url The url of the Application
   * @return  Behavior with no document
   * @return  Behavior when receive a invalid document
   * @return  Behavior when receive a valid document with invalid properties
   * @return  Behavior when receive a valid document with valid properties without gender
   * @return  Behavior when receive a valid document with valid properties with gender as Female
   * @return  Behavior when receive a valid document with valid properties with gender as Male
   *
   */
  create(url){
    var auth = this.auth; //self / this does not work inside the describe, so I do this way
    var route = this.route; //self / this does not work inside the describe, so I do this way

    describe('POST ' + route, function(){
      it('Should verify the behavior with no document', function(done){
        request
          .post({url: url + route + auth, form: undefined}, function(error, response, body){
            assert.equal(response.statusCode, 400, "Error in response status code. Should be 400");
            done();
          });
      });

      it('Should verify the behavior when receive a invalid document', function(done){
        request
          .post({url: url + route + auth, form: {test: 'Wrong'}}, function(error, response, body){
            assert.equal(response.statusCode, 400, "Error in response status code. Should be 400");
            done();
          });
      });

      it('Should verify the behavior when receive a valid document with invalid properties', function(done){
        request
          .post({url: url + route + auth, form: {age: 'NA', name: 1, married: 'Nop', uid: '1234567890'}}, function(error, response, body){
            assert.equal(response.statusCode, 400, "Error in response status code. Should be 400");
            done();
          });
      });

      it('Should verify the behavior when receive a valid document with valid properties without gender', function(done){
        request
          .post({url: url + route + auth, form: {age: 29, name: 'Thiago', married: true, uid: '096857631'}}, function(error, response, body){
            assert.equal(response.statusCode, 200, "Error in response status code. Should be 200");
            done();
          });
      });

      it('Should verify the behavior when receive a valid document with valid properties with gender as Female', function(done){
        request
          .post({url: url + route + auth, form: {age: 29, name: 'Cecilia', married: true, uid: '096858631', gender: 'Female'}}, function(error, response, body){
            assert.equal(response.statusCode, 200, "Error in response status code. Should be 200");
            done();
          });
      });

      it('Should verify the behavior when receive a valid document with valid properties with gender as Male', function(done){
        request
          .post({url: url + route + auth, form: {age: 29, name: 'Caldana', married: true, uid: '097616631', gender: 'Male'}}, function(error, response, body){
            assert.equal(response.statusCode, 200, "Error in response status code. Should be 200");
            done();
          });
      });
    });
  }

  /**
   * Will perform tests aiming one part of the API: GET /api/example
   * @param {string} url The url of the Application
   * @return  Behavior with no specific document as parameter
   * @return  Behavior with an specific document as parameter that does not exists
   * @return  Behavior with an specific document as parameter that exists
   */
  read(url){
    var auth = this.auth; //self / this does not work inside the describe, so I do this way
    var route = this.route; //self / this does not work inside the describe, so I do this way

    describe('GET ' + route, function(){
      it('Should verify the behavior with no specific document as parameter', function(done){
        request
          .get({url: url + route + auth, form: undefined}, function(error, response, body){
            assert.equal(response.statusCode, 200, "Error in response status code. Should be 200");
            assert.equal(Array.isArray(JSON.parse(body)), true, 'Error in the returned object. Should be an array');
            done();
          });
      });

      it('Should verify the behavior with an specific document as parameter that does not exists', function(done){
        request
          .get({url: url + route + auth + '&uid=088123631', form: undefined}, function(error, response, body){
            body = (body!==undefined) ? JSON.parse(body) : undefined;


            assert.equal(response.statusCode, 200, "Error in response status code. Should be 200");
            assert.equal(Array.isArray(body), true, 'Error in the returned object. Should be an array');
            assert.equal(body.length, 0, 'Error in the returned. Should be an empty array');
            done();
          });
      });

      it('Should verify the behavior with an specific document as parameter that exists', function(done){
        request
          .get({url: url + route + auth + '&uid=097616631', form: undefined}, function(error, response, body){
            body = (body!==undefined) ? JSON.parse(body) : undefined;

            assert.equal(response.statusCode, 200, "Error in response status code. Should be 200");
            assert.equal(Array.isArray(body), true, 'Error in the returned object. Should be an array');
            assert.equal(body.length, 1, 'Error in the returned. Should return an array with 1 position only');
            done();
          });
      });
    });
  }

  /**
   * Will perform tests aiming one part of the API: GET /api/example
   * @param {string} url The url of the Application
   * @return  Behavior with no document
   * @return  Behavior with valid document but mising required properties
   * @return  Behavior with valid document with all required properties
   */
  update(url){
    var auth = this.auth; //self / this does not work inside the describe, so I do this way
    var route = this.route; //self / this does not work inside the describe, so I do this way
    var validObject = {
      age: 14,
      name: "Lucy",
      married: true,
      uid: "096858631",
      gender: "Female",
    };

    describe('PUT ' + route, function(){
      it('Should verify the behavior with no document', function(done){
        request
          .put({url: url + route + auth, form: undefined}, function(error, response, body){
            assert.equal(response.statusCode, 400, "Error in response status code. Should be 400");
            done();
          });
      });

      it('Should verify the behavior with valid document but mising required properties', function(done){
        delete validObject.uid;
        request
          .put({url: url + route + auth, form: validObject}, function(error, response, body){
            assert.equal(response.statusCode, 400, "Error in response status code. Should be 400");
            done();
          });
      });

      it('Should verify the behavior with valid document with all required properties', function(done){
        validObject.uid = "096858631";
        request
          .put({url: url + route + auth + '&uid=' + validObject.uid, form: validObject}, function(error, response, body){
            body = (body!==undefined) ? JSON.parse(body) : undefined;

            assert.equal(response.statusCode, 200, "Error in response status code. Should be 200");
            assert.equal(body.ok, true, 'Error in the returned object. Should be true');
            done();
          });
      });
    });
  }

  /**
   * Will perform tests aiming one part of the API: GET /api/example
   * @param {string} url The url of the Application
   * @return Behavior with no params
   * @return Behavior with params that no exists
   * @return Behavior with params that exists
   * @return Behavior with params that exists and will force it to be removed from database
   */
  delete(url){
    var auth = this.auth; //self / this does not work inside the describe, so I do this way
    var route = this.route; //self / this does not work inside the describe, so I do this way

    describe('DELETE ' + route, function(){
      it('Should verify the behavior with no params', function(done){
        request
          .delete({url: url + route + auth, form: undefined}, function(error, response, body){
            assert.equal(response.statusCode, 400, "Error in response status code. Should be 400");
            assert.equal(body, "Missing parameters", "Error in the response. Should be: Missing parameters");
            done();
          });
      });

      it('Should verify the behavior with params that no exists', function(done){
        request
          .delete({url: url + route + auth + '&uid=098866432', form: undefined}, function(error, response, body){
            assert.equal(response.statusCode, 400, "Error in response status code. Should be 400");
            done();
          });
      });

      it('Should verify the behavior with params that exists', function(done){
        request
          .delete({url: url + route + auth + '&uid=096858631', form: undefined}, function(error, response, body){
            assert.equal(response.statusCode, 200, "Error in response status code. Should be 200");
            done();
          });
      });

      it('Should verify the behavior with params that exists and will force it to be removed from database', function(done){
        request
          .delete({url: url + route + auth + '&uid=097616631&force=true', form: undefined}, function(error, response, body){
            assert.equal(response.statusCode, 200, "Error in response status code. Should be 200");
            done();
          });
      });

      it('Should verify the behavior with params that exists', function(done){
        request
          .delete({url: url + route + auth + '&uid=096857631&force=true', form: undefined}, function(error, response, body){
            assert.equal(response.statusCode, 200, "Error in response status code. Should be 200");
            done();
          });
      });
    });
  }

  /**
   * Will perform tests aiming one part of the API: GET /api/example
   * @param {string} url The url of the Application
   * @return Behavior of the custom queries
   */
  custom(url){
    var auth = this.auth; //self / this does not work inside the describe, so I do this way

    describe('GET /example/custom', function(){
      it('Should verify the behavior of the custom queries', function(done){
        request
          .get({url: url + '/example/custom' + auth, form: undefined}, function(error, response, body){
            assert.equal(response.statusCode, 200, "Error in response status code. Should be 200");
            done();
          });
      });
    });
  }
}

/** * @module Example */
module.exports = Test;
