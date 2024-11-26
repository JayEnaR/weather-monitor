import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { MQTT_TOPCIS } from '../../../mqtt/mqtt_topics';
import { MatButtonModule } from '@angular/material/button';
import * as L from 'leaflet';
import { ClientStatusService } from '../../../services/client-status.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-device-location',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './device-location.component.html',
  styleUrl: './device-location.component.scss',
})
export class DeviceLocationComponent implements AfterViewInit, OnDestroy {
  coordinates: L.LatLngLiteral;
  private map: any;
  circle: any;
  isOnline: boolean = false;
  unsub$: Subject<void> = new Subject<void>();

  constructor(
    private _mqttService: MqttService,
    public _clientStatusService: ClientStatusService
  ) {
    this.coordinates = { lat: 0, lng: 0 };

    this._clientStatusService.status$
      .pipe(takeUntil(this.unsub$))
      .subscribe((stat) => {
        this.isOnline = stat;
        if (this.isOnline && !this.hasCoordinates) {
          this.findDevice();
        }
      });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.initSubscriptions();
  }

  private initMap(): void {
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

  private initSubscriptions(): void {
    this._mqttService
      .observeRetained(MQTT_TOPCIS.coordinates, { qos: 1 })
      .pipe(takeUntil(this.unsub$))
      .subscribe((res) => {
        const coord = res.payload.toString().split(',');

        this.coordinates.lat = +coord[0];
        this.coordinates.lng = +coord[1];

        this.map.setView(this.coordinates, 19);
        this.circle.setLatLng(this.coordinates);
      });
  }

  private findDevice(): void {
    // TODO: Temp and humid go to zero after find device is called
    this._mqttService
      .publish(MQTT_TOPCIS.findDevice, 'find_device', { qos: 1, retain: false })
      .subscribe(() => {
        console.log('Finding device...');
      });
  }

  private hasCoordinates(): boolean {
    return this.coordinates.lat != 0 && this.coordinates.lng != 0;
  }

  private clearSubscriptions(): void{
    this.unsub$.next();
    this.unsub$.complete();
  }

  ngOnDestroy(): void {
    this.clearSubscriptions();
  }
}
