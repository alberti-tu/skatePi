import { Component } from '@angular/core';

import { Device } from "../../models/device";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  device: Device; // Complete device information

  constructor( ) {
    //this.device = JSON.parse(localStorage.getItem('device'));
  }
}
