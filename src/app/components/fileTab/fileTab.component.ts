import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DataService } from '../../services/data.service';
import 'rxjs/add/operator/takeUntil';
import { BaseComponent } from '../shared/base.component';

@Component({
  selector: 'app-file-tab',
  templateUrl: './fileTab.component.html',
  styleUrls: ['./fileTab.component.scss']
})
export class FileTabComponent extends BaseComponent implements OnInit {
  public resources: any[];
  private readonly AWSServerlessTypeColor = [
    { type: "AWS::Serverless::Api", color: '#00e600', opacityColor: '#00e60030' },
    { type: "AWS::Serverless::Application", color: '#ffff33', opacityColor: '#ffff3330' },
    { type: "AWS::Serverless::Function", color: '#ff3333', opacityColor: '#ff333330' },
    { type: "AWS::Serverless::LayerVersion", color: '#003cb3', opacityColor: '#003cb330' },
    { type: "AWS::Serverless::SimpleTable", color: '#ff80ff', opacityColor: '#ff80ff30' }
  ];
  
  constructor(private dataService: DataService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.dataService.uploadFiles$
    .takeUntil(this.unsubscribe)
    .subscribe(() => {
      this.loadResources();
    });

    if (this.dataService.selectedTab >= 0) {
      this.loadResources();
    }
  }

  private loadResources() {
    const content = this.dataService.getContent();
      const res = content.Resources;
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

  public selectedFile(): boolean {
    return this.dataService.selectedTab >= 0;
  }

  public openResource(resource: any) {
    console.log('HERE', resource);
    this.dataService.selectedResource = resource;
    this.router.navigateByUrl('/resource');
  }
}
