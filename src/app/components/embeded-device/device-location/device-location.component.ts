import { AfterViewInit, Component } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { MQTT_TOPCIS } from '../../../mqtt/mqtt_topics';
import { MatButtonModule } from '@angular/material/button';
import * as L from 'leaflet';

@Component({
  selector: 'app-device-location',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './device-location.component.html',
  styleUrl: './device-location.component.scss',
})
export class DeviceLocationComponent implements AfterViewInit {
  coordinates: L.LatLngLiteral;
  private map: any;
  circle: any;

  constructor(private _mqttService: MqttService) {
    this.coordinates = { lat: 0, lng: 0 };
    this.initSubscriptions();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map', {
      center: this.coordinates,
      zoom: 18,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution: '',
      }
    );

    tiles.addTo(this.map);
    this.circle = L.circle(this.coordinates, {
      color: 'red',
      fillColor: '#ff003378',
      fillOpacity: 0.5,
      radius: 40,
    });
    this.circle.addTo(this.map);
  }

  initSubscriptions(): void {
    this._mqttService
      .observe(MQTT_TOPCIS.coordinates, { qos: 1, rap: true })
      .subscribe((res) => {
        const coord = res.payload.toString().split(',');

        this.coordinates.lat = +coord[0];
        this.coordinates.lng = +coord[1];

        /**
         * TODO:
         * Use coordinates to display in map
         * Update map when coordinates changes
         */
console.log(this.coordinates);

        this.map.setView(this.coordinates, 18);
        this.circle.setLatLng(this.coordinates);
      });
  }

  findDevice(): void {
    // TODO: Temp and humid go to zero after find device is called
    this._mqttService
      .publish(MQTT_TOPCIS.findDevice, 'find_device', { qos: 1, retain: false })
      .subscribe(() => {
        console.log('Finding device...');
      });
  }
}
