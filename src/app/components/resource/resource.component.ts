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
                this.initialResource = JSON.parse(JSON.stringify(resource));
                this.resource = this.initialResource;
                console.log('REEEESOURCE:', this.resource);
            }
        });

        console.log('URL:', this.router.url);

        if (this.dataService.selectedResource) {
            this.initialResource = JSON.parse(JSON.stringify(this.dataService.selectedResource));
            this.resource = this.initialResource;
            console.log('Resource:', this.resource);
        }
    }

    public resourceExists() {
        return !!this.resource;
    }

    public hasChanged(): boolean {
        return this.initialResource !== this.resource;
    }

    public reset(): void {
        this.resource = this.initialResource;
    }
}