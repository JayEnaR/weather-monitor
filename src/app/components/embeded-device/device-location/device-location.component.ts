import { Component } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { MQTT_TOPCIS } from '../../../mqtt/mqtt_topics';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-device-location',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './device-location.component.html',
  styleUrl: './device-location.component.scss',
})
export class DeviceLocationComponent {
  coordinates: string = '';

  constructor(private _mqttService: MqttService) {
    this.initSubscriptions();
  }

  initSubscriptions(): void {
    this._mqttService
      .observe(MQTT_TOPCIS.coordinates, { qos: 1, rap: true })
      .subscribe((res) => {
        const coord = res.payload.toString();
        this.coordinates = coord;
        /**
         * TODO:
         * Use coordinates to display in map
         * Update map when coordinates changes
         */
      });
  }

  findDevice(): void {
    this._mqttService
      .publish(MQTT_TOPCIS.findDevice, 'find_device', { qos: 1, retain: false })
      .subscribe(() => {
        console.log('Finding device...');
      });
  }
}
