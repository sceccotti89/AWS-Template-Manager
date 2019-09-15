import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { FileTabComponent } from './fileTab/fileTab.component';
import { CommonModule } from '@angular/common';
import { AwsValidatorService } from './services/aws-validator.service';
import { ResourceComponent } from './fileTab/resource/resource.component';

@NgModule({
  declarations: [
    AppComponent,
    FileTabComponent,
    ResourceComponent
  ],
  imports: [
    BrowserModule, 
    CommonModule,
    FormsModule, // <-- here
    RoundProgressModule // <-- and here
  ],
  providers: [AwsValidatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
