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
require("rxjs/add/operator/switchMap");
var core_1 = require("@angular/core");
var ng2_file_upload_1 = require("ng2-file-upload");
var http_1 = require("@angular/http");
var FilesComponent = (function () {
    function FilesComponent(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.filesUrl = 'http://localhost:8000/files/upload'; // URL to web api
        this.uploader = new ng2_file_upload_1.FileUploader({ url: this.filesUrl });
    }
    FilesComponent.prototype.ngOnInit = function () {
    };
    ;
    return FilesComponent;
}());
FilesComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-files',
        templateUrl: 'files.component.html',
    }),
    __metadata("design:paramtypes", [http_1.Http])
], FilesComponent);
exports.FilesComponent = FilesComponent;
//# sourceMappingURL=files.component.js.map