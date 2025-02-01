import { Injectable } from '@angular/core';
import { ITempHumidModel } from '../models/ITempHumid.model';
import { combineLatest, ReplaySubject } from 'rxjs';
import { MqttService } from 'ngx-mqtt';
import { ClientStatusService } from './client-status.service';
import { MQTT_TOPCIS } from '../mqtt/mqtt_topics';
import { Time } from '../helpers/time';
import { IndexedDbService } from './indexed-db.service';
import { ConfigService } from './config.service';
import { IIndexedDbError } from '../models/IIndexedDbError.model';
import { IMqttPayload } from '../models/IMqttPayload.model';

@Injectable({
  providedIn: 'root',
})
export class TempHumidService {
  private tempHumidSrc = new ReplaySubject<ITempHumidModel>(1);
  $tempHumid = this.tempHumidSrc.asObservable();
  intervals: number;
  private prevTempMsgId: number = 0;
  private prevHumidMsgId: number = 0;

  constructor(
    private _mqttService: MqttService,
    private _clientStatusService: ClientStatusService,
    private _indexedDbService: IndexedDbService,
    private _configService: ConfigService
  ) {
    this.intervals = this._configService.config.chartSeriesIntervals;
    this.observeTempHumid();
  }

  private observeTempHumid(): void {
    this._clientStatusService.status$.subscribe((isOnline) => {
      if (isOnline) {
        combineLatest([
          this._mqttService.observeRetained(MQTT_TOPCIS.temperature, {
            qos: 1,
            rh: 2,
          }),
          this._mqttService.observeRetained(MQTT_TOPCIS.humidity, {
            qos: 1,
            rh: 2,
          }),
        ]).subscribe(([temp, humid]) => {
          const temperature: IMqttPayload = JSON.parse(temp.payload.toString());
          const humidity: IMqttPayload = JSON.parse(humid.payload.toString());

          // Handle duplicate message
          if (
            (!humid.dup && humid.messageId != this.prevHumidMsgId) ||
            (!temp.dup && temp.messageId != this.prevTempMsgId)
          ) {
            this.prevHumidMsgId = humid.messageId!;
            this.prevTempMsgId = temp.messageId!;

            const obj: ITempHumidModel = {
              id: `${temperature.stamp}-${humidity.stamp}`,
              temperature: +temperature.msg,
              humidity: +humidity.msg,
              time: Time.getTime(),
            };

            this.tempHumidSrc.next(obj);
            // State management
            this._indexedDbService.getRowCount().subscribe((c) => {
              // TODO: Change this to signal
              // Only hold x amount of items
              if (c == this.intervals) {
                // Delete oldest
                this._indexedDbService.removeFirst();
              }
              // Add
              if (c < this.intervals) {
                this._indexedDbService.add(obj).subscribe({
                  next: (x) => {},
                  complete: () => {},
                  error: (e: IIndexedDbError) => {
                    // console.log(e.inner.code);
                    if (e.inner.code == 0) {
                      // Key exists - Delete db
                      // console.log(e);
                      // this._indexedDbService.clearDb();
                    }
                  },
                });
              }
            });
          }
        });
      }
    });
  }
}
