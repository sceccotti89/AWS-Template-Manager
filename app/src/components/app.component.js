"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.STORAGE_FILES = "files";
        if (window.require) {
            try {
                this.ipc = window.require('electron').ipcRenderer;
            }
            catch (error) {
                throw error;
            }
        }
        else {
            console.warn('Could not load electron ipc');
        }
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ipc.on('openFile', function (event, message) {
            var files = message;
            if (typeof (Storage) !== "undefined") {
                var storage = window.localStorage;
                var openFiles_1 = JSON.parse(storage.getItem(_this.STORAGE_FILES)) || [];
                files.forEach(function (filePath) {
                    if (!openFiles_1.some(function (file) { return file === filePath; })) {
                        openFiles_1.push(filePath);
                        _this.openFile(filePath);
                    }
                });
                storage.setItem(_this.STORAGE_FILES, JSON.stringify(openFiles_1));
            }
        });
        this.loadOpenFiles();
    };
    AppComponent.prototype.loadOpenFiles = function () {
        var _this = this;
        if (typeof (Storage) !== "undefined") {
            var storage = window.localStorage;
            var openFiles = JSON.parse(storage.getItem("files")) || [];
            openFiles.forEach(function (filePath) { return _this.openFile(filePath); });
        }
    };
    AppComponent.prototype.openFile = function (filePath) {
        var _this = this;
        var xhr = new XMLHttpRequest();
        xhr.onloadend = function (event) {
            if (event.loaded && xhr.response) {
                var contents = xhr.responseText;
                // TODO save the object into a service to be rendered on screen
            }
            else {
                var storage = window.localStorage;
                var files = JSON.parse(storage.getItem(_this.STORAGE_FILES));
                files.splice(files.findIndex(function (file) { return file === filePath; }), 1);
                storage.setItem(_this.STORAGE_FILES, JSON.stringify(files));
            }
        };
        xhr.open('GET', filePath);
        xhr.send();
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            templateUrl: './app.component.html',
        }),
        __metadata("design:paramtypes", [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map