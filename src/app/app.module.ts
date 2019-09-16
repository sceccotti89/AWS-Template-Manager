import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { FileTabComponent } from './components/fileTab/fileTab.component';
import { CommonModule } from '@angular/common';
import { AwsValidatorService } from './services/aws-validator.service';
import { ResourceComponent } from './components/resource/resource.component';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './services/data.service';
import { BaseComponent } from './components/shared/base.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    FileTabComponent,
    ResourceComponent
  ],
  imports: [
    BrowserModule, 
    CommonModule,
    AppRoutingModule
  ],
  providers: [AwsValidatorService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
