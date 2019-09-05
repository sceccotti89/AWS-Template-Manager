import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
  // styleUrls: ['app/app.component.css']
})
export class AppComponent implements OnInit {
  private STORAGE_FILES = "files";
  private ipc: any;

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
  }

  ngOnInit() {
    this.ipc.on('openFile', (event, message) => {
        const files = message;
        if (typeof(Storage) !== "undefined") {
            const storage = window.localStorage;
            const openFiles: string[] = JSON.parse(storage.getItem(this.STORAGE_FILES)) || [];

            files.forEach((filePath) => {
                if (!openFiles.some((file) => file === filePath)) {
                    openFiles.push(filePath);
                    this.openFile(filePath);
                }
            });

            storage.setItem(this.STORAGE_FILES, JSON.stringify(openFiles));
        }
    });

    this.loadOpenFiles();
  }

  private loadOpenFiles() {
      if (typeof(Storage) !== "undefined") {
        const storage = window.localStorage;
        const openFiles: string[] = JSON.parse(storage.getItem("files")) || [];
        openFiles.forEach((filePath) => this.openFile(filePath));
      }
  }

  private openFile(filePath) {
    const xhr = new XMLHttpRequest();
    xhr.onloadend = (event) => {
        if (event.loaded && xhr.response) {
            const contents = xhr.responseText;
            // TODO save the object into a service to be rendered on screen
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
}
