//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// The .spec.js file isn't member of the backend template is just an example how to test a feature without integrate the entire app //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*jshint esversion: 6 */
const Test = require('./test');
const url = require('../../app.js').forTests() + "/api"; //starts the server and return it's URL

describe('', function(){
  //used to give some time to raise the application
  this.timeout(1000);
  before(function(done){
    setTimeout(done, 500);
  });

  new Test().execute(url);
});
