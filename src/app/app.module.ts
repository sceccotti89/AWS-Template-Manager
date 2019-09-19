import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { FileTabComponent } from './components/fileTab/fileTab.component';
import { CommonModule } from '@angular/common';
import { AwsValidatorService } from './services/aws-validator.service';
import { ResourceComponent } from './components/resource/resource.component';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './services/data.service';
import { BaseComponent } from './components/shared/base.component';
import { ResourceApiComponent } from './components/resource/resource-api/resource-api.component';
import { FileService } from './services/file.service';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    FileTabComponent,
    ResourceComponent,
    ResourceApiComponent
  ],
  imports: [
    BrowserModule, 
    CommonModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [AwsValidatorService, DataService, FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
