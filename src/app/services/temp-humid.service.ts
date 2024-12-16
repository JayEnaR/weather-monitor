import { Injectable } from '@angular/core';
import { ITempHumidModel } from '../models/ITempHumid.model';
import { combineLatest, ReplaySubject } from 'rxjs';
import { MqttService } from 'ngx-mqtt';
import { ClientStatusService } from './client-status.service';
import { MQTT_TOPCIS } from '../mqtt/mqtt_topics';
import { Time } from '../helpers/time';

@Injectable({
  providedIn: 'root',
})
export class TempHumidService {
  private tempHumidSrc = new ReplaySubject<ITempHumidModel>(1);
  $tempHumid = this.tempHumidSrc.asObservable();

  constructor(
    private _mqttService: MqttService,
    private _clientStatusService: ClientStatusService
  ) {
    this.observeTempHumid();
  }

  private observeTempHumid(): void {
    this._clientStatusService.status$.subscribe((status) => {
      if (status) {
        combineLatest([
          this._mqttService.observe(MQTT_TOPCIS.temperature, { qos: 1 }),
          this._mqttService.observe(MQTT_TOPCIS.humidity, { qos: 1 }),
        ]).subscribe(([temp, humid]) => {
          this.tempHumidSrc.next({
            id: (temp.messageId! + humid.messageId!).toString(),
            temperature: +temp.payload,
            humidity: +humid.payload,
            time: Time.getTime(),
          });
        });
      }
    });
  }
}
