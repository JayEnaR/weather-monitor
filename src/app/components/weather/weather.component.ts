import { Component, OnDestroy } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { WeatherService } from '../../services/weather.service';
import { dematerialize, Subject, takeUntil } from 'rxjs';
import { MQTT_TOPCIS } from '../../mqtt/mqtt_topics';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { IWeatherResponse } from '../../models/weather-response.model';
import { DecimalRound } from "../../helpers/decimalRound";

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
    private _weatherService: WeatherService
  ) {
    this.getGpsCoordinates();
  }

  private getGpsCoordinates(): void {
    this._mqttService
      .observeRetained(MQTT_TOPCIS.coordinates, { qos: 1 })
      .pipe(takeUntil(this.$unsubStatus))
      .subscribe((res) => {
        const coord = res.payload.toString().split(',');
        if (coord[0] && coord[1]) {
          // Weather api
          this._weatherService
            .getWeather(coord[0], coord[1])
            .subscribe((res) => {
              res.main = {
                ...res.main,
                temp: DecimalRound.roundNum(res.main.temp, 1),
                humidity: DecimalRound.roundNum(res.main.humidity, 1),
              }
              console.log(res);
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
