var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});

var schema = {
    "$id": "http://json-schema.org/draft-04/schema#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "AWSTemplateFormatVersion": {
            "type": "string",
            "pattern": "([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"
        },
        "Transform": { "type": "string" },
        "Resources": {
            "paths": {
                "type": "object",
                "patternProperties": {
                    "^\/[0-9].*\\?|$": {
                        "type": "object",
                        "properties": {
                            "value": {
                                "type": "number"
                            }
                        }   
                    }
                }
            }
        }
    }
};

var validate = ajv.compile(schema);

test({
    "paths": {
        "/[]": {
            "value": 10
        }
    }
});

function test(data) {
  var valid = validate(data);
  if (valid) console.log('Valid!');
  else console.log('Invalid: ' + ajv.errorsText(validate.errors));
}