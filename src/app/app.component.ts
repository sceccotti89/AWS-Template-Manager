import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FileTab, FileStorage } from './models/data.model';
import { AwsValidatorService } from './services/aws-validator.service';
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
  private STORAGE_FILES = "files";
  private storage = window.localStorage;

  public isIpcLoaded: boolean; // TODO use this to adjust the UI
  public fileTabs: FileTab[] = [];

  constructor(private awsValidator: AwsValidatorService) {
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
          const openFiles: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES)) || [];

          files.forEach((filePath) => {
            if (!openFiles.some((file) => file === filePath)) {
              openFiles.push({ name: filePath, selected: true });
              this.openFile(filePath, true);
            }
          });

          this.storage.setItem(this.STORAGE_FILES, JSON.stringify(openFiles));
        }
      });
    }

    this.loadOpenFiles();
  }

  private loadOpenFiles() {
    if (this.storage) {
      const openFiles: FileStorage[] = JSON.parse(this.storage.getItem("files")) || [];
      openFiles.forEach((file) => this.openFile(file.name, file.selected));
    }
  }

  private openFile(filePath: string, selected: boolean): void {
    const xhr = new XMLHttpRequest();
    xhr.onloadend = (event) => {
      if (event.loaded && xhr.response) {
        const content = xhr.responseText;

        // Validate the file content.
        const validationResult = this.awsValidator.validate(content);
        if (!validationResult.isValid) {
          console.warn(validationResult.validationErrors);
        } else {
          const filePaths = filePath.split('/');
          this.fileTabs.push({ name: filePaths[filePaths.length - 1], content: content, selected });
        }
      } else if (this.storage) {
        const files: FileStorage[] = JSON.parse(this.storage.getItem(this.STORAGE_FILES));
        files.splice(files.findIndex((file) => file.name === filePath), 1);
        this.storage.setItem(this.STORAGE_FILES, JSON.stringify(files));
      }
    }
    xhr.open('GET', filePath);
    xhr.send();
  }

  public selectedTab(index: number) {
    this.fileTabs[index].selected = true;
  }
}
