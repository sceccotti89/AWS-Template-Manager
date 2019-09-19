import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FileStorage } from './models/data.model';
import { AwsValidatorService } from './services/aws-validator.service';
import { DataService } from './services/data.service';
import { FileService } from './services/file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private ipc: any;

  public isIpcLoaded: boolean; // TODO use this to adjust the UI
  @ViewChild('fileLoader') fileLoader: ElementRef;

  constructor(private awsValidator: AwsValidatorService,
    private dataService: DataService,
    private fileService: FileService) {
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

        files.forEach((filePath) => {
          if (!this.fileService.isFileExisitingInStorage(filePath)) {
            this.openFile(filePath, true, true);
          }
        });
      });
    }

    this.loadOpenFiles();
  }

  private loadOpenFiles() {
    const openFiles: FileStorage[] = this.fileService.getAllFilesInStorage();
    openFiles.forEach((file) => this.openFile(file.path + file.name, file.selected, false));
  }

  private openFile(filePath: string, selected: boolean, store: boolean): void {
    const xhr = new XMLHttpRequest();
    xhr.onloadend = (event) => {
      if (event.loaded && xhr.response) {
        const content = xhr.responseText;
        this.validateFile(filePath, content, selected, store);
      } else {
        this.fileService.removeFileFromStorage(filePath);
      }
    };
    xhr.open('GET', filePath);
    xhr.send();
  }

  private validateFile(filePath: string, content: any, selected: boolean, store: boolean) {
    let awsObject;
    try {
      awsObject = JSON.parse(content);
    } catch (error) {
      this.fileService.removeFileFromStorage(filePath);
      return console.error(error);
    }

    // Validate the file content.
    const validationResult = this.awsValidator.validate(awsObject);
    if (!validationResult.isValid) {
      console.warn(validationResult.validationErrors);
      this.fileService.removeFileFromStorage(filePath);
    } else {
      const filePaths = filePath.split('/');
      this.dataService.addFile(filePaths[filePaths.length - 1], awsObject, selected);
      if (store) {
        this.fileService.addFileIntoStorage(filePath, selected);
      }
    }
  }

  public get fileTabs() {
    return this.dataService.fileTabs;
  }

  public setSelectedTab(index: number) {
    this.dataService.setSelectedTab(index);
  }

  public onFilesSelected(): void {
    const _this = this;
    const files: { [key: string]: File } = this.fileLoader.nativeElement.files;
    const keys = Object.keys(files);
    keys.forEach((key, index) => {
      const file = files[key];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = function (evt) {
        const content = evt.target['result'];
        _this.validateFile('/' + file.name, content, index === keys.length - 1, false);
      };
    });
  }
}
