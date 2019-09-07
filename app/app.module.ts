import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }   from './src/components/app.component';
import { FileService } from './src/services/file.service';
import { BaseComponent } from './src/components/shared/base.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [
                  AppComponent,
                  BaseComponent
                ],
  providers:    [ FileService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
