import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import {
  BehaviorSubject,
  filter,
  finalize,
  Observable,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { MQTT_TOPCIS } from '../mqtt/mqtt_topics';

@Injectable({
  providedIn: 'root',
})
export class GpsService {

  isGpsSearching$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private coordinates$: ReplaySubject<IMqttMessage> = new ReplaySubject<IMqttMessage>(1);

  constructor(private _mqttService: MqttService) {}

  // THE ONLY THING THAT IS GOING TO TELL gpsSearching TO STOP IS THE RESULT FROM GPS COORDINATES. THATS WHAT WE NEED

  getGpsCoordinates(): Observable<IMqttMessage> {
      return this.coordinates$.asObservable();
  }

  setGpsCoordinate(message: IMqttMessage): void {
    this.coordinates$.next(message);
  }

  locateDevice(): void {
    this.isGpsSearching$.next(true);
    this._mqttService
      .publish(MQTT_TOPCIS.findDevice, 'find_device')
      .subscribe();
  }
}
