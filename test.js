/*jshint esversion: 6 */
const app = require('./app.js'); //starts the server
const fs = require('fs');
const url = app.forTests() + "/api";
var testModules = {};

//////////////////////////////////////////////////////////////////////////
//Arrow functions do not work on mocha, so we are using only javascript //
//////////////////////////////////////////////////////////////////////////

/**
 * Will execute Assertion Tests across all features of the application
 * @memberof Server
 */
class Tests{
  constructor(){
    console.log('////////////////////////////////////////////////');
    console.log('// Start Assertion tests into the application //');
    console.log('////////////////////////////////////////////////');
  }

  /**
   * Will check inside the feature modules for all features and test all together.
   */
  execute(){
    return describe('API', function(){
      //used to give some time to raise the application
      this.timeout(3000);
      before(function(done){
        setTimeout(done, 2500);
      });

      var directories = fs.readdirSync('./features/');
      for (let directory of directories){
        if (directory.includes('.')===false) { //means is a directory
          var files = fs.readdirSync('./features/' + directory);
          var index = files.indexOf('test.js');

          if (index > -1) {//found the test
            let moduleName = files[index].substring(0, (files[index].length-3)); //removing the '.js'
            testModules[directory] = require('./features/' + directory + "/" + moduleName);

            /* jshint ignore:start */
            describe(directory.toUpperCase(), function(){
              var feature = new testModules[directory]();

              return feature.execute(url);
            });
            /* jshint ignore:end */
          }
        }
      }
    });
  }
}
//Initialize the Tests class to execute it's functions.
let tests = new Tests();

module.exports = tests.execute();

//The app will be terminated after the tests.
