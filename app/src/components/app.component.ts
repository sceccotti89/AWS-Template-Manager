import { Component, OnInit } from '@angular/core';
import { FileService } from '../services/file.service';
import { BaseComponent } from './shared/base.component';

@Component({
  selector: 'my-app',
  templateUrl: 'app/src/components/app.component.html',
  styleUrls: ['app/src/components/app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  constructor(private fileService: FileService) {
    super();
  }

  ngOnInit() {
    // this.fileService.openFile$
    //   .takeUntil(this.unsubscribe)
    //   .subscribe();
  }
}
