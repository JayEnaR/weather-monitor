import { Component, OnDestroy } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { ClientStatusService } from '../../services/client-status.service';
import { MQTT_TOPCIS } from '../../mqtt/mqtt_topics';
import { ChartComponent } from '../chart/chart.component';
import { CommonModule } from '@angular/common';
import { StringToNumberPipe } from '../../helpers/numberConvert.pipe';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatMenu, MatIcon, ChartComponent, CommonModule, StringToNumberPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnDestroy {
  humidity: string = '0';
  temperature: string = '0';
  prevHumMsgId: number = 0;
  prevTempMsgId: number = 0;
  $unsub: Subject<void> = new Subject<void>();
  $unsubStatus: Subject<void> = new Subject<void>();
  temperatureUpdates: number = 0;
  humidityUpdates: number = 0;

  constructor(
    private _mqttService: MqttService,
    private _clientStatusService: ClientStatusService
  ) {
    this.initMqtt();
  }

  initMqtt(): void {
    // Online Status
    this._clientStatusService.status$
    .pipe(takeUntil(this.$unsubStatus))
    .subscribe((status) => {
      if (!status) {
        this.humidity = '0';
        this.temperature = '0';
        this.$unsub.next();
        this.$unsub.complete();
      } else {
        // Temperature
        this._mqttService
          .observeRetained(MQTT_TOPCIS.temperature, { qos: 1 })
          .pipe(takeUntil(this.$unsub))
          .subscribe((t: IMqttMessage) => {
            if (!t.dup && t.messageId != this.prevTempMsgId) {
              this.temperature = t.payload.toString();
              this.prevTempMsgId = t.messageId!;
              this.temperatureUpdates ++;
            }
          });
        // Humidity
        this._mqttService
          .observeRetained(MQTT_TOPCIS.humidity, { qos: 1 })
          .pipe(takeUntil(this.$unsub))
          .subscribe((h: IMqttMessage) => {
            if (!h.dup && h.messageId != this.prevHumMsgId) {
              this.humidity = h.payload.toString();
              this.prevHumMsgId = h.messageId!;
              this.humidityUpdates ++;
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.$unsubStatus.next();
    this.$unsubStatus.complete();
  }
}
