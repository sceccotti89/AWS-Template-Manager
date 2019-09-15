import { Injectable } from "@angular/core";
import * as Ajv from "ajv";
import { ValidationResult } from "../models/data.model";

@Injectable()
export class AwsValidatorService
{
    private ajv;
    private validationErrors;

    private readonly AWSServerlessType = [
        { type: "AWS::Serverless::Api", func: this.validateAWSServerlessApiSchema },
        { type: "AWS::Serverless::Application", func: this.validateAWSServerlessApplicationSchema },
        { type: "AWS::Serverless::Function", func: this.validateAWSServerlessFunctionSchema },
        { type: "AWS::Serverless::LayerVersion", func: this.validateAWSServerlessLayerVersionSchema },
        { type: "AWS::Serverless::SimpleTable", func: this.validateAWSServerlessSimpleTableSchema }
    ];

    constructor() {
        // [{"name":"assets/app_spec.json","selected":true}]
        this.ajv = new Ajv({ allErrors: true });
    }

    private validateSchema(data: any): boolean {
        const schema = {
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
                                    "type": "object"
                                }
                            } 
                        }
                    }
                }
            }
        };

        const validator = this.ajv.compile(schema);
        const valid = validator(data);
        this.validationErrors = validator.errors;
        return valid;
    }

    private validateAWSServelessSchema(data: any): boolean {
        const AWStype = this.AWSServerlessType.find((awsType) => awsType.type === data.Type);
        if (AWStype && AWStype.func) {
            return AWStype.func.bind(this)(data.Properties);
        }
        this.validationErrors = "AWS Serverless type " + data.type + " not found";
        return false;
    }

    private validateAWSServerlessApiSchema(data: any): boolean {
        console.log("AWS API data:", data);
        const schema = {
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
        };

        const validator = this.ajv.compile(schema);
        const valid = validator(data);
        this.validationErrors = this.ajv.errorsText(validator.errors);
        return valid;
    }

    private validateAWSServerlessApplicationSchema(data: any): boolean {
        // console.log("AWS Application data:", data);
        return true;
    }

    private validateAWSServerlessFunctionSchema(data: any): boolean {
        // console.log("AWS Function data:", data);
        return true;
    }

    private validateAWSServerlessLayerVersionSchema(data: any): boolean {
        // console.log("AWS LayerVersion data:", data);
        return true;
    }

    private validateAWSServerlessSimpleTableSchema(data: any): boolean {
        // console.log("AWS SimpleTable data:", data);
        return true;
    }

    private validateData(data: any): any {
        console.log(data);
        if (this.validateSchema(data)) {
            return Object.keys(data.Resources).reduce((valid, key) => {
                return valid && this.validateAWSServelessSchema(data.Resources[key]);
            }, true);
        }
        return false;
    }

    public validate(data: any): ValidationResult {
        const valid = this.validateData(data);
        if (valid) {
            return new ValidationResult(true, null);
        } else {
            return new ValidationResult(false, this.validationErrors);
        }
    }
}
