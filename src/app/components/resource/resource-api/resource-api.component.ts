import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'app-resource-api',
    templateUrl: './resource-api.component.html',
    styleUrls: ['./resource-api.component.scss']
})
export class ResourceApiComponent implements OnInit {
    @Input() content: any;

    public visibility: { name: string, visible: boolean }[];

    constructor() {}

    ngOnInit() {
        console.log('CONTENT:', this.content);
        this.visibility = Object.keys(this.content).map((key) => ({ name: key, visible: true}));
    }

    public selectedContent(name: string): void {
        const data = this.visibility.find((visible) => visible.name === name);
        data.visible = !data.visible;
    }

    public getEnumerableData(data): any[] {
        return Object.keys(data);
    }

    public isVisible(name: string): boolean {
        return this.visibility.find((visible) => visible.name === name).visible;
    }
}
