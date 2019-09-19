import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-resource-api',
    templateUrl: './resource-api.component.html',
    styleUrls: ['./resource-api.component.scss']
})
export class ResourceApiComponent {
    @Input() content: any;

    constructor() {}


}
