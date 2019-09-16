export interface FileStorage {
    name: string;
    path: string;
    selected: boolean;
}

export interface FileTab {
    name: string;
    content: any;
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
