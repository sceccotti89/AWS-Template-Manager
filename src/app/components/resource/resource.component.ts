import { Component, OnInit } from "@angular/core";
import { DataService } from "../../services/data.service";
import { Router } from "@angular/router";
import { AWSTypes } from "../../models/constants";
import { BaseComponent } from "../shared/base.component";

@Component({
    selector: 'app-resource',
    templateUrl: './resource.component.html',
    styleUrls: ['./resource.component.scss']
})
export class ResourceComponent extends BaseComponent implements OnInit {
    public initialResource: any;
    public resource: any;

    public readonly AWSTypes = AWSTypes;
    public awsTypes: string[];

    constructor(private router: Router, private dataService: DataService) {
        super();
        this.awsTypes = Object.values(AWSTypes);
    }

    ngOnInit() {
        this.dataService.selectedResource$
        .takeUntil(this.unsubscribe)
        .subscribe((resource) => {
            if (resource) {
                this.initialResource = this.clone(resource);
                this.resource = this.clone(resource);
                console.log('REEEESOURCE:', this.resource);
            }
        });

        console.log('URL:', this.router.url);

        if (this.dataService.selectedResource) {
            this.initialResource = this.clone(this.dataService.selectedResource);
            this.resource = this.clone(this.dataService.selectedResource);
            console.log('Resource:', this.resource);
        }
    }

    private clone(data: any): any {
        return JSON.parse(JSON.stringify(data));
    }

    public resourceExists(): boolean {
        return !!this.resource;
    }

    public hasChanged(): boolean {
        return JSON.stringify(this.initialResource) !== JSON.stringify(this.resource);
    }

    public reset(): void {
        this.resource = this.clone(this.initialResource);
    }
}