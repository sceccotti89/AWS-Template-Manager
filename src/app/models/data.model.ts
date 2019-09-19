export interface FileStorage {
    id: string;
    name: string;
    path: string;
    resource: string;
    selected: boolean;
}

export interface FileTab {
    id: string;
    name: string;
    content: any;
    resource: string;
    selected: boolean;
}

export class ValidationResult {
    public isValid: boolean;
    public validationErrors: any;
    
    constructor(isValid: boolean, errors: any) {
        this.isValid = isValid;
        this.validationErrors = errors;
    }
}
