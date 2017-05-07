/*jshint esversion: 6 */
const fs = require('fs');
const YAML = require('json2yaml');
const swagger = require('../../features/swagger/conf');
const glob = require('glob');
var features = {};

/**
 * Will run over all features looking for
 * @memberof Server
 */
class SwaggerIt{
  /**
   * Will initiate an object of type SwaggerIt
   */
  constructor(){}

  /**
   * Will iterate over the directores to create the swagger json and yaml files.
   */
  generate(){
    var self = this;
    return new Promise((resolve, reject)=>{
      const options = {realpath: true};

      glob('./features/**/swagger.json', options, (er, fileNames) => {
        for (let fileName of fileNames){
          let tmpArray = fileName.split('/');
          let feature = tmpArray[tmpArray.length-2];

          if (feature!=='swagger'){
            let swaggerFeature = self._fetchValidJSON(fileName, feature);

            for (let properties in swaggerFeature){
              swagger.paths[properties] = swaggerFeature[properties];
            }
          }
        }

        resolve(swagger);
      });
    });
  }

  /**
   * Allow the documentation to be generated directly through the command line
   */
  now(){
    var self = this;

    self._start();

    self.generate()
    .then(function(swagger){
      fs.writeFileSync('./features/swagger/swagger.yaml', YAML.stringify(swagger, null, "\t"));
      fs.writeFileSync('./features/swagger/swagger.json', JSON.stringify(swagger, null, "\t"));

      self._end();
    });
  }

  /**
   * Warns the terminal that the file creation has started
   */
  _start(){
    console.log('////////////////////////////////////////////////');
    console.log('//        Creating the Swagger file           //');
    console.log('//                                            //');
  }

  /**
   * Warns the terminal that the file creation has ended
   */
  _end(){
    console.log('//        ./api/swagger/swagger.yaml          //');
    console.log('//        ./api/swagger/swagger.json          //');
    console.log('//                                            //');
    console.log('//             Files created                  //');
    console.log('////////////////////////////////////////////////');
  }

  _fetchValidJSON(path, feature){
    try {
      let jsonFile = fs.readFileSync(path);

      return JSON.parse(jsonFile);
    } catch (e) {
      return undefined;
    }
  }
}

/** @module Server */
module.exports = SwaggerIt;
