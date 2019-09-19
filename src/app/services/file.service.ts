import { Injectable } from "@angular/core";
import { FileStorage } from "../models/data.model";

@Injectable()
export class FileService
{
    private readonly STORAGE_FILES = 'files';
    private readonly storage = window.localStorage;

    constructor() {}

    public hasStorage(): boolean {
        return !!this.storage;
    }

    public getAllFilesInStorage(): FileStorage[] {
        if (this.storage) {
            return JSON.parse(this.storage.getItem(this.STORAGE_FILES)) || [];
        }
        return [];
    }

    public isFileExisitingInStorage(filePath: string): boolean {
        if (this.storage) {
            const index = filePath.lastIndexOf('/');
            const path = filePath.substr(0, index + 1);
            const name = filePath.substr(index + 1);
            const openFiles: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES)) || [];
            return openFiles.some((file) => file.name === name && file.path === path);
        }
    
        return false;
    }
    
    public addFileIntoStorage(filePath: string, selected: boolean): void {
        if (this.storage) {
            const index = filePath.lastIndexOf('/');
            const path = filePath.substr(0, index + 1);
            const name = filePath.substr(index + 1);
            const openFiles: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES)) || [];
            openFiles.push({ name, path, selected });
            this.storage.setItem(this.STORAGE_FILES, JSON.stringify(openFiles));
        }
    }
    
    public removeFileFromStorage(filePath: string): void {
        if (this.storage) {
            const index = filePath.lastIndexOf('/');
            const path = filePath.substr(0, index + 1);
            const name = filePath.substr(index + 1);
            const files: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES));
            files.splice(files.findIndex((file) => file.name === name && file.path === path), 1);
            this.storage.setItem(this.STORAGE_FILES, JSON.stringify(files));
        }
    }
}
