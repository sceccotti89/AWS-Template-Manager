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
    { type: "AWS::Serverless::Api", color: '#00e600', opacityColor: '#00e60030' },
    { type: "AWS::Serverless::Application", color: '#ffff33', opacityColor: '#ffff3330' },
    { type: "AWS::Serverless::Function", color: '#ff3333', opacityColor: '#ff333330' },
    { type: "AWS::Serverless::LayerVersion", color: '#003cb3', opacityColor: '#003cb330' },
    { type: "AWS::Serverless::SimpleTable", color: '#ff80ff', opacityColor: '#ff80ff30' }
  ];
  
  constructor() {}

  ngOnInit() {
    const res = this.content.Resources;
    console.log(res);
    this.resources = Object.keys(res)
      .map((key) => {
        const awsType = this.AWSServerlessTypeColor.find((color) => color.type === res[key].Type);
        return {
          name: key,
          content: res[key],
          color: awsType.color,
          opacityColor: awsType.opacityColor
        };
      });
    console.log(this.resources);
  }
}
