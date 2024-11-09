import { Component } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { ClientStatusService } from '../../services/client-status.service';
import { DecimalRound } from "../../helpers/decimalRound";
import { MQTT_TOPCIS } from "../../mqtt/mqtt_topics";

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
  humidity: string = '0';
  temperature: string = '0';
  prevHumMsgId: number = 0;
  prevTempMsgId: number = 0;

  constructor(
    private _mqttService: MqttService,
    private _clientStatusService: ClientStatusService
  ) {
    this.initMqtt();
    this.chartOptions = {};

    this._mqttService.onConnect.subscribe(res => console.log(res));
    this._mqttService.onMessage.subscribe(msg => console.log(msg));
    this._mqttService.onOffline.subscribe(() => {
      // Update client status
      this._clientStatusService.updateStatus(false);
    });
  }

  initMqtt(): void {
    // Online Status
    this._mqttService
      .observeRetained(MQTT_TOPCIS.connectionStatus, { qos: 1, rap: false })
      .subscribe((m: IMqttMessage) => {
        console.log(m);

        const statusResponse = m.payload.toString();
        const isOnline: boolean = (statusResponse.trim().toLowerCase().startsWith('connect') ? true : false);
        console.log(`Online: ${isOnline} (${statusResponse})`);

        if (isOnline) {
          // Temperature
          this._mqttService
            .observeRetained(MQTT_TOPCIS.temperature, { qos: 1 })
            .subscribe((t: IMqttMessage) => {
              console.log(t);

              if (!t.dup && t.messageId != this.prevTempMsgId) {
                this.temperature = t.payload.toString();
                this.prevTempMsgId = t.messageId!;
              }
            });

          // Humidity
          this._mqttService
            .observeRetained(MQTT_TOPCIS.humidity, { qos: 1 })
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
