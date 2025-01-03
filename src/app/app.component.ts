import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { ClientStatusService } from './services/client-status.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MqttService } from 'ngx-mqtt';
import { MQTT_TOPCIS } from './mqtt/mqtt_topics';
import { GpsService } from './services/gps.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatMenuModule,
    MatButton,
    MatIcon,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  online: boolean = false;

  constructor(
    private _matIconReg: MatIconRegistry,
    public _clientStatusService: ClientStatusService,
    private _gspService: GpsService,
    private _mqttService: MqttService
  ) {
    this._matIconReg.setDefaultFontSetClass('material-symbols-outlined');
    this._clientStatusService.status$.subscribe((res) => (this.online = res));

    this._mqttService
      .observeRetained(MQTT_TOPCIS.lastWill, { qos: 2 })
      .subscribe((status) => {
        const statusResponse = status.payload.toString();
        const isOnline: boolean = statusResponse
          .trim()
          .toLowerCase()
          .startsWith('connect')
          ? true
          : false;
        console.log(`Online: ${isOnline} (${statusResponse})`);
        this._clientStatusService.updateStatus(isOnline);
      });

    this._mqttService
      .observeRetained(MQTT_TOPCIS.coordinates, {
        qos: 1,
      })
      .subscribe((res) => {
        this._gspService.isGpsSearching$.pipe(take(1)).subscribe((s) => {
          if (!res.retain && s) {
            this._gspService.isGpsSearching$.next(false);
          }
          this._gspService.setGpsCoordinate(res);
        });
      });
  }
}
