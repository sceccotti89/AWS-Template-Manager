import { Component, OnInit } from '@angular/core';
import { FileStorage } from './models/data.model';
import { AwsValidatorService } from './services/aws-validator.service';
import { DataService } from './services/data.service';
// import 'rxjs/add/observable/interval';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/takeWhile';
// import 'rxjs/add/operator/do';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private ipc: any;
  private readonly STORAGE_FILES = "files";
  private readonly storage = window.localStorage;

  public isIpcLoaded: boolean; // TODO use this to adjust the UI

  constructor(private awsValidator: AwsValidatorService,
    private dataService: DataService) {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }

    this.isIpcLoaded = !!this.ipc;
  }

  ngOnInit() {
    if (this.ipc) {
      this.ipc.on('openFile', (event, message) => {
        const files = message;
        if (this.storage) {
          files.forEach((filePath) => {
            if (!this.isFileExisitingInStorage(filePath)) {
              this.openFile(filePath, true, true);
            }
          });
        }
      });
    }

    this.loadOpenFiles();
  }

  private loadOpenFiles() {
    if (this.storage) {
      const openFiles: FileStorage[] = JSON.parse(this.storage.getItem("files")) || [];
      openFiles.forEach((file) => this.openFile(file.name, file.selected, false));
    }
  }

  private openFile(filePath: string, selected: boolean, store: boolean): void {
    const xhr = new XMLHttpRequest();
    xhr.onloadend = (event) => {
      if (event.loaded && xhr.response) {
        const content = xhr.responseText;
        const awsObject = JSON.parse(content);

        // Validate the file content.
        const validationResult = this.awsValidator.validate(awsObject);
        if (!validationResult.isValid) {
          console.warn(validationResult.validationErrors);
          this.removeFileFromStorage(filePath);
        } else {
          const filePaths = filePath.split('/');
          this.dataService.addFile(filePaths[filePaths.length - 1], awsObject, selected);
          if (store) {
            this.addFileIntoStorage(filePath, selected);
          }
        }
      } else {
        this.removeFileFromStorage(filePath);
      }
    }
    xhr.open('GET', filePath);
    xhr.send();
  }

  private isFileExisitingInStorage(filePath: string): boolean {
    if (this.storage) {
      const openFiles: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES)) || [];
      return openFiles.some((file) => file.name === filePath);
    }

    return false;
  }

  private addFileIntoStorage(name: string, selected: boolean): void {
    if (this.storage) {
      const openFiles: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES)) || [];
      openFiles.push({ name, selected });
      this.storage.setItem(this.STORAGE_FILES, JSON.stringify(openFiles));
    }
  }

  private removeFileFromStorage(filePath: string): void {
    if (this.storage) {
      const files: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES));
      files.splice(files.findIndex((file) => file.name === filePath), 1);
      this.storage.setItem(this.STORAGE_FILES, JSON.stringify(files));
    }
  }

  public get fileTabs() {
    return this.dataService.fileTabs;
  }

  public setSelectedTab(index: number) {
    this.dataService.setSelectedTab(index);
  }
}
