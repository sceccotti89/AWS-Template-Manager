import { Component, OnInit } from "@angular/core";
import { DataService } from "../../services/data.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-resource',
    templateUrl: './resource.component.html',
    styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
    public initialResource: any;
    public resource: any;

    constructor(private router: Router, private dataService: DataService) {}

    ngOnInit() {
        if (!this.dataService.selectedResource) {
            this.router.navigateByUrl('/home');
        } else {
            this.initialResource = JSON.parse(JSON.stringify(this.dataService.selectedResource));
            this.resource = this.initialResource;
            console.log('Resource:', this.resource);
        }
    }

    public hasChanged(): boolean {
        return this.initialResource !== this.resource;
    }

    public reset(): void {
        this.resource = this.initialResource;
    }
}