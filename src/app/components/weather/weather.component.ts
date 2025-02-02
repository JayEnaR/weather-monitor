import { Component, OnDestroy } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { WeatherService } from '../../services/weather.service';
import { dematerialize, Subject, takeUntil } from 'rxjs';
import { MQTT_TOPCIS } from '../../mqtt/mqtt_topics';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { IWeatherResponse } from '../../models/IWeatherResponse.model';
import { DecimalRound } from "../../util/decimalRound";
import { GpsService } from '../../services/gps.service';
import { IMqttPayload } from '../../models/IMqttPayload.model';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [MatMenu, MatIcon],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements OnDestroy {
  $unsubStatus: Subject<void> = new Subject<void>();
  weather: IWeatherResponse = {
    main:{
      temp: 0,
      humidity: 0
    }
  } as IWeatherResponse;

  constructor(
    private _mqttService: MqttService,
    private _weatherService: WeatherService,
    private _gpsService: GpsService
  ) {
    this.getGpsCoordinates();
  }

  private getGpsCoordinates(): void {
    this._gpsService.getGpsCoordinates()
      .pipe(takeUntil(this.$unsubStatus))
      .subscribe((res) => {
        const coord : IMqttPayload = JSON.parse(res.payload.toString());
        const split = coord.msg.split(',');
        if (split[0] && split[1]) {
          // Weather api
          this._weatherService
            .getWeather(split[0], split[1])
            .subscribe((res) => {
              res.main = {
                ...res.main,
                temp: DecimalRound.roundNum(res.main.temp, 1),
                humidity: DecimalRound.roundNum(res.main.humidity, 1),
              }
              this.weather = res;
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsubStatus.next();
    this.$unsubStatus.next();
  }
}
