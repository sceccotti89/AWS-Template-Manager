import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FileTab } from './models/data.model';
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

  public isIpcLoaded: boolean; // TODO use this to adjust the UI
  public fileTabs: FileTab[] = [];

  constructor() {
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
        if (typeof(Storage) !== "undefined") {
          const storage = window.localStorage;
          const openFiles = JSON.parse(storage.getItem(this.STORAGE_FILES)) || [];

          files.forEach((filePath) => {
            if (!openFiles.some((file) => file === filePath)) {
              openFiles.push(filePath);
              this.openFile(filePath);
            }
          });

          storage.setItem(this.STORAGE_FILES, JSON.stringify(openFiles));
        }
      });
    }

    this.loadOpenFiles();
  }

  private loadOpenFiles() {
    if (typeof(Storage) !== "undefined") {
      const storage = window.localStorage;
      const openFiles = JSON.parse(storage.getItem("files")) || [];
      openFiles.forEach((filePath) => this.openFile(filePath));
    }
  }

  private openFile(filePath: string): void {
    const xhr = new XMLHttpRequest();
    xhr.onloadend = (event) => {
      if (event.loaded && xhr.response) {
        const content = xhr.responseText;
        const filePaths = filePath.split('/');
        this.fileTabs.push({ name: filePaths[filePaths.length - 1], content: content });
      } else {
        const storage = window.localStorage;
        const files = JSON.parse(storage.getItem(this.STORAGE_FILES));
        files.splice(files.findIndex((file) => file === filePath), 1);
        storage.setItem(this.STORAGE_FILES, JSON.stringify(files));
      }
    }
    xhr.open('GET', filePath);
    xhr.send();
  }

  public selectedTab(name: string) {
    console.log("Selected:", name);
  }
}
