import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({template: ''})
export class BaseComponent implements OnDestroy {
    protected unsubscribe: Subject<any> = new Subject();

    constructor() { }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}