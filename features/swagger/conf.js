module.exports = {
    "swagger": "2.0",
    "info": {
        "title": "ECMA2015 Backend Example",
        "description": "Documents all APIs related with this project",
        "version": "0.0.1"
    },
    "host": "ecma2015-backend-model.w3ibm.mybluemix.net",
    "schemes": [
        "http"
    ],
    "basePath": "/api",
    "produces": [
        "application/json"
    ],
    "paths": {},
    "definitions": {
        "Error": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "integer",
                    "format": "int32"
                },
                "message": {
                    "type": "string"
                }
            }
        },
        "database": {
    			"type": "object",
    			"properties": {
    				"ok": {
    					"type": "boolean"
    				},
    				"id": {
    					"type": "string"
    				},
    				"rev": {
    					"type": "string"
    				}
    			}
    		}
    }
};
