import { Component } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { ClientStatusService } from '../../services/client-status.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatMenu,
    MatIcon,
    NgApexchartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public chartOptions: ApexOptions;
  temperature: string = '';
  prevHumMsgId: number = 0;
  prevTempMsgId: number = 0;
  humidity: string = '';

  constructor(
    private _mqttService: MqttService,
    private _clientStatusService: ClientStatusService
  ) {
    this.chartOptions = {};
  }

  initMqtt(): void {
    // Online Status
    this._mqttService
      .observeRetained('ESP32_4WIN/status', { qos: 1, rap: false })
      .subscribe((m: IMqttMessage) => {
        const statusResponse = m.payload.toString();
        const isOnline: boolean = statusResponse === 'Online' ? true : false;

        if (isOnline) {
          // Temperature
          this._mqttService
            .observeRetained('E9564F1C-3845-4955-BAEC-E39FBF3D613A', { qos: 1 })
            .subscribe((t: IMqttMessage) => {
              console.log(t);

              if (!t.dup && t.messageId != this.prevTempMsgId) {
                this.temperature = t.payload.toString();
                this.prevTempMsgId = t.messageId!;
              }
            });

          // Humidity
          this._mqttService
            .observeRetained('424178CD-B52E-42C2-ACF2-F0B7C71A14FD', { qos: 1 })
            .subscribe((h: IMqttMessage) => {
              console.log(h);

              if (!h.dup && h.messageId != this.prevHumMsgId) {
                this.humidity = h.payload.toString();
                this.prevHumMsgId = h.messageId!;
              }
            });
        } else {
          this.temperature = '0';
          this.humidity = '0';
        }

        // Indicate the client status
        this._clientStatusService.updateStatus(isOnline);
      });
  }
}