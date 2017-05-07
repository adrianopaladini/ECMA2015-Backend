# ECMA2015 Server Template - v0.0.1 [Beta]

My intention here was to create a project that's allow us to reuse code and increate the team velocity. All code inside this project can be changed to adapt the team. This was create only as an example.

### Getting the Server online
1. Upgrade the version of yourNodeJS to v6.6.0. See the module [N][];
2. Also is recommended to upgrade the version of your npm to v3.10.8. I ran on terminal ```npm update npm@3.10.8```;
3. I use JSDoc in this project, os is recommended you to install it. See the section **Code Documentation**;
4. Clone the project ECMA2015_Backend_Model from [Github][];
5. On the root folder of the project execute ```npm install```;
6. To raise the server run ```node app.js``` on the project root folder. See the section **Debugging** if you are in the mood =);
7. Check the console to get the url from the application;
8. Install the CouchDb module [Install Couch DB][]
9. On terminal. press Ctrl+T to create a new tab.
10. Run the command ```couchDB``` to raise the database server locally;
11. On browser, check the same URL provided to you by the couchDB module, and add /_utils at the end. It will allow u to access the couchDB and check it’s databases on browser.

PS: If you are opening the couch by the first time, make sure to have the application server live, or you won’t be able to see your database on the list.

[Install Couch DB]: http://docs.couchdb.org/en/stable/install/mac.html

## Code Documentation

Since until now I didn't see a tool being used to do this kind of documentation, I decided to use the [JSDoc][] because it is clean and aldo easy to handle.

### Installing and configuring
1. On your Terminal run the command: ```npm install jsdoc -g```.
2. Since you are installing the jsdoc globally, you will be able to just run jsdoc.
3. On the project root folder check the file jsdoc.json for jsdoc configuration.
4. Also, on ```/usr/local/lib/node_modules/jsdoc/``` create a conf.json and add a property ```"exclude": ["node_modules"],``` inside the *source* property. This will stop tracking the node_modules file.
5. After that, on terminal just run ```jsdoc -c jsdoc.json -R README.md ./``` to execute the json recursively and also start your page with project ReadME.md;
6. Open your app into the browser [http://localhost.com:3000/documentation/jsdoc/index.html][]*, you will use this url to check your documentation ;

[http://localhost.com:3000/documentation/jsdoc/index.html]: http://localhost.com:3000/documentation/jsdoc/index.html

## Debugging

Debug is a important tool to check your code on backend, here is how to use it.

### How to use it

1. On terminal, execute ```npm install -g devtool```, access [devtool][] module for more information
2. Access your root project folder.
3. if you want to debug just your APIs, run: ```devtool app.js```.
4. If you want to debug the server from the begining, before it starts, run: ```devtool app.js --break```.


[JSDoc]: https://github.com/jsdoc3/jsdoc
[devtool]: https://mattdesl.svbtle.com/debugging-nodejs-in-chrome-devtools

## Mocha

This backend include a unit test feature that allow users to test each feature individually or integrate the test with all features of the application. To use it, install [Mocha][] (I recommend you to install it globally);

### How to do tests (features individually)

1. After create your API based on Example API;
2. Put on test.spec.js the method from your Test class you want to test;
3. On terminal, run ```mocha ./features/<yourfeature>/test.spec.js```;

### How to do tests (Integrated Tests)

1. After create your API based on Example API;
2. On terminal, run ```mocha```;

[Mocha]: https://mochajs.org/#installation

## Swagger

The swagger API documentation was include to help to improve the documentation of the application, but due the work to keep it updated and also generate the documentation if better the team decide the best approach first.

### How to create the Swagger documentation

1. Close your chrome browser (for real, press ```Ctrl+Q``` with chrome opened);
2. On terminal, run ```/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security --user-data-dir```
3. It will start the chrome for you but allowing the CORS-proxy;
4. Open the [Swagger Editor][], it will be helpful for you to track changes and do fixes;
5. Open the [Swagger Live Demo][], it will help you to see your documentation;
6. Open your app into the browser [http://localhost.com:3000/documentation/swagger/swagger.json][]*, you will use this url on Swagger Live Demo;
7. Great, now hands on :D. On terminal, run ```gulp``` on project $root folder;
8. On the app you will need to create a swagger.json file inside your feature (use the [Swagger Specification][] to learn how);
9. For global configurations, check the ```./api/swagger/conf.js``` on your project file;
10. Have Fun! (possible? :S);

[Swagger Editor]: http://editor.swagger.io/#/
[Swagger Live Demo]: http://petstore.swagger.io/
[http://localhost.com:3000/documentation/swagger/swagger.json]: http://localhost.com:3000/documentation/swagger/swagger.json
[Swagger Specification]: http://swagger.io/specification/

*: *In that example we are using the port 3000 (default one) but you can change to the one used in your project*;
