import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeviceLocationComponent } from './components/embeded-device/device-location/device-location.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'find-device', component: DeviceLocationComponent }
];
