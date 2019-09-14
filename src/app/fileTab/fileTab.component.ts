import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-file-tab',
  templateUrl: './fileTab.component.html',
//   styleUrls: ['./fileTab.component.scss']
})
export class FileTabComponent {
  @Input() content;
  
  constructor() {}
}
