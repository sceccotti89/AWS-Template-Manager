import { Injectable } from "@angular/core";
import { FileTab } from "../models/data.model";
import { Subject } from "rxjs/Subject";

@Injectable()
export class DataService
{
    public fileTabs: FileTab[] = [];
    public selectedTab = -1;
    public selectedResource: any;

    private uploadFilesSource = new Subject<void>();
    public uploadFiles$ = this.uploadFilesSource.asObservable();

    constructor() {}

    public setSelectedTab(index: number): void {
        this.fileTabs[index].selected = true;
        this.selectedTab = index;
    }

    public addFile(filePath: string, content: any, selected: boolean): void {
        this.fileTabs.push({ name: filePath, content, selected });
        if (selected) {
            this.selectedTab = this.fileTabs.length - 1;
            this.uploadFilesSource.next();
        }
    }

    public getContent(): any {
        console.log('FileTabs:', this.fileTabs);
        return this.fileTabs[this.selectedTab].content;
    }
}
