import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { ClientStatusService } from '../../services/client-status.service';
import { MQTT_TOPCIS } from '../../mqtt/mqtt_topics';
import { ChartComponent } from '../chart/chart.component';
import { CommonModule } from '@angular/common';
import { StringToNumberPipe } from '../../helpers/numberConvert.pipe';
import { combineLatest, from, Observable, of, Subject, takeUntil } from 'rxjs';
import { WeatherComponent } from '../weather/weather.component';
import { IndexedDbService } from '../../services/indexed-db.service';
import { ConfigService } from '../../services/config.service';
import { ITempHumidModel } from '../../models/ITempHumid.model';
import { Time } from '../../helpers/time';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatMenu,
    MatIcon,
    ChartComponent,
    CommonModule,
    StringToNumberPipe,
    WeatherComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnDestroy, OnInit {
  prevHumMsgId: number = 0;
  prevTempMsgId: number = 0;
  $unsub: Subject<void> = new Subject<void>();
  $unsubStatus: Subject<void> = new Subject<void>();
  temperatureUpdates: number = 0;
  humidityUpdates: number = 0;
  intervals: number;
  tempHumidObj: ITempHumidModel;

  constructor(
    private _mqttService: MqttService,
    private _clientStatusService: ClientStatusService,
    private _indexeDbService: IndexedDbService,
    private _configService: ConfigService
  ) {
    this.intervals = this._configService.config.chartSeriesIntervals;
    this.tempHumidObj = this.initDefault();
    console.log(this.tempHumidObj);
    
  }

  async ngOnInit(): Promise<void> {
    this.initMqtt();
    // this._indexeDbService.removeFirst();
  }

  async initMqtt(): Promise<void> {
    // Online Status
    this._clientStatusService.status$
      .pipe(takeUntil(this.$unsubStatus))
      .subscribe((status) => {
        if (!status) {
          this.tempHumidObj = this.initDefault();
          this.$unsub.next();
          this.$unsub.complete();
        } else {
          combineLatest([
            this._mqttService.observe(MQTT_TOPCIS.temperature, { qos: 1 }),
            this._mqttService.observe(MQTT_TOPCIS.humidity, { qos: 1 }),
          ])
            .pipe(takeUntil(this.$unsub))
            .subscribe(([t, h]) => {
              
              this.tempHumidObj = {
                ...this.tempHumidObj,
                time: Time.getTime(),
                id: (t.messageId! + h.messageId!).toString()
              }
              if (!t.dup && t.messageId != this.prevTempMsgId) {
                this.tempHumidObj.temperature = +t.payload;
                this.prevTempMsgId = t.messageId!;
                this.temperatureUpdates++;
              }
              if (!h.dup && h.messageId != this.prevHumMsgId) {
                this.tempHumidObj.humidity = +h.payload;
                this.prevHumMsgId = h.messageId!;
                this.humidityUpdates++;
              }
              // State management
              this._indexeDbService.getRowCount().then((c) => {
                // Only hold x amount of items
                if (c == this.intervals) {
                  // Delete oldest
                  this._indexeDbService.removeFirst();
                }
                this._indexeDbService.add(this.tempHumidObj);
              });
            });
        }
      });
  }

  initDefault(): ITempHumidModel {
    return {
      id: '',
      humidity: 0,
      temperature: 0,
      time: ''
    }
  }

  ngOnDestroy(): void {
    this.$unsubStatus.next();
    this.$unsubStatus.complete();
  }
}
