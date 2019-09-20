import { Injectable } from "@angular/core";
import { FileTab } from "../models/data.model";
import { Subject } from "rxjs/Subject";
import { Router } from "@angular/router";
import { FileService } from "./file.service";

@Injectable()
export class DataService
{
    public fileTabs: FileTab[] = [];
    public selectedTab = -1;

    public selectedResource: any;
    public initialSelectedResource: any;

    private uploadFilesSource = new Subject<void>();
    public uploadFiles$ = this.uploadFilesSource.asObservable();

    private selectedResourceSource = new Subject<any>();
    public selectedResource$ = this.selectedResourceSource.asObservable();

    constructor(private router: Router, private fileService: FileService) {}

    public setSelectedTab(index: number): void {
        if (this.selectedTab === index && this.fileTabs[index].selected) {
            return;
        }

        if (this.selectedTab >= 0 && this.selectedTab < this.fileTabs.length) {
            this.fileTabs[this.selectedTab].selected = false;
            this.fileService.updateFileInStorage(this.fileTabs[this.selectedTab]);
        }
        this.fileTabs[index].selected = true;
        this.fileService.updateFileInStorage(this.fileTabs[index]);
        this.selectedTab = index;
        this.uploadFilesSource.next();
        this.router.navigateByUrl('/home');
    }

    public getSelectedTab(): FileTab {
        if (this.selectedTab < 0) {
            return null;
        }
        return this.fileTabs[this.selectedTab];
    }

    public addFile(id: string, filePath: string, content: any, selected: boolean, resourceId: string): void {
        this.fileTabs.push({ id: id, name: filePath, content, resource: resourceId, selected });
        if (selected) {
            this.selectedTab = this.fileTabs.length - 1;
            this.uploadFilesSource.next();

            if (resourceId && this.router.url.includes('q=')) {
                const urlResourceId = this.router.url.substr(this.router.url.indexOf('q=') + 2);
                if (urlResourceId === resourceId) {
                    const key = Object.keys(content.Resources).find((key) => key === resourceId);
                    const resource = { 'content': content.Resources[key], 'name': resourceId };
                    this.setSelectedResource(resource);
                    this.selectedResourceSource.next(resource);
                }
            }
        }
    }

    public setSelectedResource(resource: any): void {
        const file: FileTab = this.getSelectedTab();
        file.resource = resource.name;
        this.fileService.updateFileInStorage(file);

        this.selectedResource = resource;
        this.initialSelectedResource = JSON.parse(JSON.stringify(resource));
    }

    public resetResource(): void {
        this.selectedResource = this.initialSelectedResource = null;
    }

    public getContent(): any {
        console.log('FileTabs:', this.fileTabs);
        return this.fileTabs[this.selectedTab].content;
    }
}
