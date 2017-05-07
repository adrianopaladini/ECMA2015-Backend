var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('default', ['js-doc', 'swagger-gen'], function() {
  //Watch over files for JSDoc
  gulp.watch([
    '**/*.js',
    '!./api/swagger/conf.js'
  ], ['js-doc']);

  //Watch over files for swagger documentation purpose.
  gulp.watch([
    './**/*.json',
    '!./api/**/*.json',
    './api/swagger/conf.js'
  ], ['swagger-gen']);
});


//Run commands to generate the JSDoc and Swagger documentation
gulp.task('js-doc', shell.task(['jsdoc -c jsdoc.json -R README.md ./'])); //Creates the JSFile based on jsdoc.json
gulp.task('swagger-gen', shell.task(['npm run swagger'], {quiet: true})); //generate a json / yaml file based on swagger doc of each feature;
