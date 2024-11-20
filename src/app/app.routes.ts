import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FindDeviceComponent } from './components/embeded-device/find-device/find-device.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'find-device', component: FindDeviceComponent }
];
