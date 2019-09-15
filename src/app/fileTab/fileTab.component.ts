import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-file-tab',
  templateUrl: './fileTab.component.html',
  styleUrls: ['./fileTab.component.scss']
})
export class FileTabComponent implements OnInit {
  @Input() content: any;

  private resources: any[];
  private readonly AWSServerlessTypeColor = [
    { type: "AWS::Serverless::Api", color: '#00e600' },
    { type: "AWS::Serverless::Application", color: '#00e600' },
    { type: "AWS::Serverless::Function", color: '#00e600' },
    { type: "AWS::Serverless::LayerVersion", color: '#00e600' },
    { type: "AWS::Serverless::SimpleTable", color: '#00e600' }
];
  
  constructor() {}

  ngOnInit() {
    const res = this.content.Resources;
    console.log(res);
    this.resources = Object.keys(res)
                      .map((key) => ({
                        name: key,
                        content: res[key],
                        bgColor: this.AWSServerlessTypeColor.find((color) => color.type === res[key].Type).color
                      }));
    console.log(this.resources);
  }

  public get getResources(): any[] {
    return this.resources;
  }
}
