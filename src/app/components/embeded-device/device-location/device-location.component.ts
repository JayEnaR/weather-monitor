import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { MQTT_TOPCIS } from '../../../mqtt/mqtt_topics';
import { MatButtonModule } from '@angular/material/button';
import * as L from 'leaflet';
import { ClientStatusService } from '../../../services/client-status.service';
import { CommonModule } from '@angular/common';
import { Subject,takeUntil } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GpsService } from '../../../services/gps.service';

@Component({
  selector: 'app-device-location',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatIcon, MatProgressSpinnerModule],
  templateUrl: './device-location.component.html',
  styleUrl: './device-location.component.scss',
})
export class DeviceLocationComponent implements AfterViewInit, OnDestroy {
  coordinates: L.LatLngLiteral;
  private map: any;
  circle: any;
  isOnline: boolean = false;
  $unsub: Subject<void> = new Subject<void>();
  locatingDevice: boolean = false;

  constructor(
    private _mqttService: MqttService,
    private _clientStatusService: ClientStatusService,
    public _gspService: GpsService
  ) {
    this.coordinates = { lat: 0, lng: 0 };

    this._clientStatusService.status$
      .pipe(takeUntil(this.$unsub))
      .subscribe((stat) => {
        this.isOnline = stat;
        if (this.isOnline && !this.hasCoordinates) {
          this.locateDevice();
        }
      });

    // this.locatingDevice = this._gspService.$gpsSearching.getValue();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.initSubscriptions();
    // console.log(this._gspService.$gpsSearching.getValue());
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

    // GSP search state
    this._gspService.$gpsSearching.subscribe((searching) => {
      this.locatingDevice = searching;
      console.log('hit0');
    });

    this._mqttService
      .observeRetained(MQTT_TOPCIS.coordinates, { qos: 1 })
      .subscribe((res) => {
        const coord = res.payload.toString().split(',');

        this.coordinates.lat = +coord[0];
        this.coordinates.lng = +coord[1];
        this.circle.setLatLng(this.coordinates);

        // Search result directly from client (state management)
        if (!res.retain && this.locatingDevice) {
          this._gspService.$gpsSearching.next(false);
          this.map.setView(this.coordinates, 19);
          console.log('hit1');

        } else if (res.retain && this.locatingDevice) {
          console.log('hit2');
          
          this.map.setView(this.coordinates, 16);
        } else if (
          (res.retain && !this.locatingDevice) ||
          (!res.retain && !this.locatingDevice)
        ) {
          console.log('hit3');

          this.map.setView(this.coordinates, 19);
        }
      });
  }

  private hasCoordinates(): boolean {
    return this.coordinates.lat != 0 && this.coordinates.lng != 0;
  }

  private clearSubscriptions(): void {
    this.$unsub.next();
    this.$unsub.complete();
  }

  locateDevice(): void {
    // TODO: Temp and humid go to zero after find device is called
    this.map.setView(this.coordinates, 16);
    // this.locatingDevice = true;
    this._mqttService
      .publish(MQTT_TOPCIS.findDevice, 'find_device')
      .subscribe();
    this._gspService.$gpsSearching.next(true);
  }

  ngOnDestroy(): void {
    this.clearSubscriptions();
  }
}
