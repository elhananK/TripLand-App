import 'rxjs/add/operator/switchMap';
import {Component, Input, OnInit} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Http } from '@angular/http';

import { Group } from "../../shared/Group";
import { GroupService } from '../../shared/group.service';
import { User } from '../../shared/user';
import { UserService } from "../../shared/user.service";


@Component({
  moduleId: module.id,
  selector: 'my-add-group',
  templateUrl: 'add-group.component.html',

})
export class AddGroupComponent implements OnInit{

    title: String = 'My Google Maps API';
    lat: number = 32.0853;
    lng: number = 34.7818;
    country_shortName: String;
    country_longName: String;

    @Input()
    inputGroup: Group;
    curUser: User;
    window: Window;


  private filesUrl = 'http://localhost:8000/groups/add';  // URL to web api
  public uploader:FileUploader = new FileUploader({url: this.filesUrl});



  constructor(private http: Http,
              private groupService: GroupService,
              private userService: UserService){
  }

  ngOnInit(){
    var self = this;
    this.userService.getCurUser()
        .then(function(user){
          self.curUser = user;
          console.log(self.curUser);
        });

  };

  AddGroup(text: String): void {
    console.log(text);

     if (!text) { return; }
     this.groupService.createGroup(text,this.country_shortName)
          .then(function(uRes){
              self.window.alert(uRes.res.message);
              console.log(uRes.res.message);
              self.window.location.href = "http://localhost:3000/groups";
          });
  }

  mapClicked( $event: any ) : void {

      this.lat = $event.coords.lat;
      this.lng = $event.coords.lng;

      this.findCountryNameByLatLng(this.lat,this.lng);
  }

  findCountryNameByLatLng(lat: number, lng: number) {
      var self = this;
        if (navigator.geolocation) {
            let geocoder = new google.maps.Geocoder();
            let latlng = new google.maps.LatLng(lat, lng);
            let request = { latLng: latlng };
            geocoder.geocode(request, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        for (var i = 0; i < results[0].address_components.length; i++) {
                            for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                                if (results[0].address_components[i].types[b] == "country") {
                                    //this is the object you are looking for
                                    self.country_shortName = results[0].address_components[i].short_name.toLowerCase();
                                    self.country_longName = results[0].address_components[i].long_name;
                                    break;
                                }
                            }
                        }
                    }
                }

            });
        }
    }

    findLatLngByCountryName(): void {
        var self = this;
        if (navigator.geolocation) {
            let geocoder = new google.maps.Geocoder();
            let request = {address: self.country_longName.toString()};

            console.log(request);
            geocoder.geocode(request, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    self.lat =  results[0].geometry.location.lat();
                    self.lng = results[0].geometry.location.lng();
                    self.findCountryNameByLatLng(self.lat,self.lng);
                } else {
                    console.log('error');
                }
            });
        }
    }

}



