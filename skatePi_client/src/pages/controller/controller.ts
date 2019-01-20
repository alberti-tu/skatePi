import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { BLE } from "@ionic-native/ble";

import { ScanPage } from "../scan/scan";
import { Device } from "../../models/device";

@IonicPage()
@Component({
  selector: 'page-controller',
  templateUrl: 'controller.html',
})
export class ControllerPage {


  device: Device;

  constructor(public navCtrl: NavController, private ble: BLE) {
    this.device = JSON.parse(localStorage.getItem('device'));
  }

  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  sendOn() {
    console.log('Data: On');
    this.ble.write(this.device.id, '12ab', '34cd', this.stringToBytes('on'));
  }

  sendOff() {
    console.log('Data: Off');
    this.ble.write(this.device.id, '12ab', '34cd', this.stringToBytes('off'));
  }

  disconnect() {
    this.ble.disconnect(this.device.id);
    localStorage.clear();
    this.navCtrl.setRoot(ScanPage);
  }
}
