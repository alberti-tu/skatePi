import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { BLE } from "@ionic-native/ble";

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { Device } from "../../models/device";
import { ScanPage } from "../scan/scan";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  device: Device;

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor(public navCtrl: NavController, private ble: BLE) {
    this.device = JSON.parse(localStorage.getItem('device'));
  }

  disconnect() {
    this.ble.disconnect(this.device.id);
    localStorage.clear();
    this.navCtrl.setRoot(ScanPage);
  }
}
