import { Component, OnInit } from "@angular/core";
import { DataService } from "../../services/data.service";
import { AWSTypes } from "../../models/constants";
import { BaseComponent } from "../shared/base.component";

@Component({
    selector: 'app-resource',
    templateUrl: './resource.component.html',
    styleUrls: ['./resource.component.scss']
})
export class ResourceComponent extends BaseComponent implements OnInit {
    public resource: any;

    public readonly AWSTypes = AWSTypes;
    public awsTypes: string[];

    constructor(private dataService: DataService) {
        super();
        this.awsTypes = Object.values(AWSTypes);
    }

    ngOnInit() {
        this.dataService.selectedResource$
        .takeUntil(this.unsubscribe)
        .subscribe((resource) => {
            if (resource) {
                this.resource = resource;
                console.log('REEEESOURCE:', this.resource === this.dataService.selectedResource);
            }
        });

        if (this.dataService.selectedResource) {
            this.resource = this.dataService.selectedResource;
            console.log('Resource!!:', this.resource);
        }
    }

    public getTypes(): string[] {
        return this.awsTypes.filter((type) => type !== this.resource.content.Type);
    }

    public resourceExists(): boolean {
        return !!this.resource;
    }
}