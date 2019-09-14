import { Injectable } from "@angular/core";
import * as Ajv from "ajv";
import { ValidationResult } from "../models/data.model";

const schema = {
    "$id": "http://json-schema.org/draft-04/schema#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "AWSTemplateFormatVersion": {
            "type": "string",
            "pattern": "([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))",
            "enum": ["2010-09-09"]
        },
        "Transform": {
            "type": "string",
            "enum": ["AWS::Serverless-2016-10-31"]
        },
        "Resources": {
            "type": "object",
            "patternProperties": {
                "^\/[0-9].*\\?|$": { // TODO non sono sicuro che sia questo il REGEX per le RESOURCES
                    "type": "object",
                    "properties": {
                        "Type": {
                            "type": "string",
                            "enum": [
                                "AWS::Serverless::Api",
                                "AWS::Serverless::Application",
                                "AWS::Serverless::Function",
                                "AWS::Serverless::LayerVersion",
                                "AWS::Serverless::SimpleTable"
                            ]
                        },
                        "Properties": {
                            "type": "object",
                            "DefinitionBody" : {
                                "type": "object",
                                "": {

                                }
                            }
                        }
                    }   
                }
            }
        }
    }
};

@Injectable()
export class AwsValidatorService
{
    private ajv;
    private validator;

    constructor() {
        this.ajv = new Ajv({ allErrors: true });
        this.validator = this.ajv.compile(schema);
    }

    public validate(data: string): ValidationResult {
        const valid = this.validator(data);
        if (valid) {
            return new ValidationResult(true, null);
        } else {
            return new ValidationResult(false, this.validator.errors);
        }
    }
}
