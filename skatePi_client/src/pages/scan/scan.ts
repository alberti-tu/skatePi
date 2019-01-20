import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { BLE } from "@ionic-native/ble";

import { Device } from "../../models/device";
import {ControllerPage} from "../controller/controller";

@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})

export class ScanPage {

  devices: Device[] = [];
  statusMessage: string;
  scanDevices: boolean;

  constructor(public navCtrl: NavController, private ble: BLE, private ngZone: NgZone) {
    this.devices = [];
    this.statusMessage = '';
    this.scanDevices = true;
  }

  ionViewDidEnter() {
    this.setStatus('Scanning...');
    this.scan();
  }

  // Every 10s scan the BLE devices
  scan() {
    this.ble.enable() // Switch on the Bluetooth if it is not
      .then(value => {  // If user enable BLE

        if(this.scanDevices == false) { return }

        this.devices = [];  // clear list

        this.ble.startScan([]).subscribe(
          device => {
            console.log('Discovered ' + JSON.stringify(device, null, 2));
            this.ngZone.run(() => {
              this.devices.push(device);
            });
          },
          error => {
            this.setStatus('Error ' + error);
          }
        );

        let temp = this;
        setTimeout(function () {
          if(temp.scanDevices == true) {
            temp.ble.stopScan();
            temp.scan();     // Continue scanning
          }
        }, 10000);   // Reload every 10s
        
      })
      .catch(reason => {  // If user do not enable BLE
        this.devices = [];  // clear list
        this.setStatus(reason);
      });
  }

  // BLE Connection with selected device
  connect(device: Device) {
    this.setStatus('Connecting to ' + device.name || device.id);

    this.ble.connect(device.id).subscribe(
      value => {
        this.setStatus('Successful connection');
        this.scanDevices = false;
        this.ble.stopScan();

        localStorage.setItem('device', JSON.stringify(value));
        this.navCtrl.setRoot(ControllerPage);
        //this.navCtrl.setRoot(TabsPage);
    },
      error => {
        console.log(JSON.stringify(error));
        this.setStatus('Impossible to connect with ' + device.name || device.id);
    });
  }

  // Start the scanning loop
  start(){
    this.setStatus('Scanning...');
    this.scanDevices = true;
    this.scan();
  }

  // Stop the scanning loop
  stop(){
    this.setStatus('Scan stopped');
    this.scanDevices = false;
    this.ble.stopScan();
  }

  // Show messages on the footer and logs
  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => { this.statusMessage = message } );
  }
}
