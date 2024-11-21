import { AfterViewInit, Component } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { MQTT_TOPCIS } from '../../../mqtt/mqtt_topics';
import { MatButtonModule } from '@angular/material/button';
import * as L from 'leaflet';
import { ClientStatusService } from '../../../services/client-status.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-device-location',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './device-location.component.html',
  styleUrl: './device-location.component.scss',
})
export class DeviceLocationComponent implements AfterViewInit {
  coordinates: L.LatLngLiteral;
  private map: any;
  circle: any;

  constructor(private _mqttService: MqttService, public _clientStatusService: ClientStatusService) {
    this.coordinates = { lat: 0, lng: 0 };
    this.initSubscriptions();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map', {
      center: this.coordinates,
      zoom: 19,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 20,
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

        this.map.setView(this.coordinates, 19);
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

  hasCoordinates(): boolean {
    debugger
    return this.coordinates.lat != 0 && this.coordinates.lng != 0;
  }
}
