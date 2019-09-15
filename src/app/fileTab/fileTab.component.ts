import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-file-tab',
  templateUrl: './fileTab.component.html',
  styleUrls: ['./fileTab.component.scss']
})
export class FileTabComponent implements OnInit {
  @Input() content: any;

  private resources: any[];
  
  constructor() {}

  ngOnInit() {
    const res = this.content.Resources;
    this.resources = Object.keys(res)
                           .map((key) => ({ name: key, content: res[key] }));
  }

  public get getResources(): any[] {
    return this.resources;
  }
}
