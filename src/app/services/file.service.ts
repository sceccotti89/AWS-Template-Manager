import { Injectable } from '@angular/core';
import { FileStorage, FileTab } from '../models/data.model';
import * as uuid from 'uuid/v4';

@Injectable()
export class FileService {
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

    public getFileFromStorage(id: string): FileStorage {
        if (this.storage) {
            const files: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES)) || [];
            return files.find((file) => file.id === id);
        }
        return null;
    }

    public updateFileInStorage(file: FileTab): void {
        if (this.storage) {
            const files: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES)) || [];
            const index = files.findIndex((f) => file.id === f.id);
            files[index].selected = file.selected;
            files[index].resource = file.resource;
            this.storage.setItem(this.STORAGE_FILES, JSON.stringify(files));
        }
    }

    public isFileExisitingInStorage(filePath: string): boolean {
        if (this.storage) {
            const index = filePath.replace('\\', '/').lastIndexOf('/');
            const path = filePath.substr(0, index + 1);
            const name = filePath.substr(index + 1);
            const openFiles: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES)) || [];
            return openFiles.some((file) => file.name === name && file.path === path);
        }
    
        return false;
    }
    
    public addFileIntoStorage(filePath: string, selected: boolean, resource: string): string {
        if (this.storage) {
            const index = filePath.replace('\\', '/').lastIndexOf('/');
            const path = filePath.substr(0, index + 1);
            const name = filePath.substr(index + 1);
            const openFiles: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES)) || [];
            const id: string = uuid();
            openFiles.push({ id, name, path, selected, resource });
            this.storage.setItem(this.STORAGE_FILES, JSON.stringify(openFiles));
            return id;
        }
        return null;
    }
    
    public removeFileFromStorage(filePath: string): void {
        if (this.storage) {
            const index = filePath.replace('\\', '/').lastIndexOf('/');
            const path = filePath.substr(0, index + 1);
            const name = filePath.substr(index + 1);
            const files: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES));
            files.splice(files.findIndex((file) => file.name === name && file.path === path), 1);
            this.storage.setItem(this.STORAGE_FILES, JSON.stringify(files));
        }
    }
}
