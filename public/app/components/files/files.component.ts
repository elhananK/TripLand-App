import 'rxjs/add/operator/switchMap';
import {Component, Input, OnInit} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Http, Headers } from '@angular/http';


@Component({
  moduleId: module.id,
  selector: 'my-files',
  templateUrl: 'files.component.html',

})
export class FilesComponent implements OnInit{

  private headers = new Headers({'Content-Type': 'application/json'});
  private filesUrl = 'http://localhost:8000/files/upload';  // URL to web api
  public uploader:FileUploader = new FileUploader({url: this.filesUrl});

  constructor(private http: Http
  ){}

  ngOnInit(){

  };

}





