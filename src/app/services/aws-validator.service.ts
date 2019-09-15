import { Injectable } from "@angular/core";
import * as Ajv from "ajv";
import { ValidationResult } from "../models/data.model";

@Injectable()
export class AwsValidatorService
{
    private schema; // TODO break schema into sub-schemas
    private ajv;
    private validator;

    constructor() {
        this.createSchema();

        this.ajv = new Ajv({ allErrors: true });
        this.validator = this.ajv.compile(this.schema);
    }

    private createSchema() {
        this.schema = {
            "$id": "http://json-schema.org/draft-04/schema#",
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "Description": { "type": "string" },
                "AWSTemplateFormatVersion": {
                    "type": "string",
                    // "pattern": "[1-2]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])", // FIXME
                    "enum": ["2010-09-09"]
                },
                "Transform": {
                    "type": "string",
                    "enum": ["AWS::Serverless-2016-10-31"]
                },
                "Resources": {
                    "type": "object",
                    "properties": {
                        "A-Za-z0-9": {
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
                                    "properties": {
                                        "DefinitionBody" : {
                                            "type": "object",
                                            "properties": {
                                                "info": {
                                                    "type": "object",
                                                    "properties": {
                                                        "title": {
                                                            "type": "object",
                                                            "properties": {
                                                                "Ref": {
                                                                    "type": "string",
                                                                    "enum": ["AWS::StackName"]
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                "paths": {
                                                    "patternProperties": {
                                                        "^\/[0-9].*\\?|$": {
                                                            "type": "object"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }   
                        }
                    }
                }
            }
        };
    }

    private addSchemaAWSServerlessApi(): void {

    }

    public validate(data: any): ValidationResult {
        const valid = this.validator(data);
        if (valid) {
            return new ValidationResult(true, null);
        } else {
            // return new ValidationResult(false, this.ajv.errorsText(this.validator.errors));
            return new ValidationResult(false, this.validator.errors);
        }
    }
}
