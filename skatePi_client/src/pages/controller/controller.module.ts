import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ControllerPage } from './controller';

@NgModule({
  declarations: [
    ControllerPage,
  ],
  imports: [
    IonicPageModule.forChild(ControllerPage),
  ],
})
export class ControllerPageModule {}
