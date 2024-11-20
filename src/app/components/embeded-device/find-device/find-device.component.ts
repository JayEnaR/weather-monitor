import { Component } from '@angular/core';
import { DeviceLocationComponent } from '../device-location/device-location.component';

@Component({
  selector: 'app-find-device',
  standalone: true,
  imports: [DeviceLocationComponent],
  templateUrl: './find-device.component.html',
  styleUrl: './find-device.component.scss'
})
export class FindDeviceComponent {

}
