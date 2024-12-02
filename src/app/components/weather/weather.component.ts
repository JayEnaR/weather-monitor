import { Component, OnDestroy } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { WeatherService } from '../../services/weather.service';
import { Subject, takeUntil } from 'rxjs';
import { MQTT_TOPCIS } from '../../mqtt/mqtt_topics';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { IWeatherResponse } from '../../models/weather-response.model';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [MatMenu, MatIcon],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements OnDestroy {
  $unsubStatus: Subject<void> = new Subject<void>();
  // TODO: We might not have coordinates here. Create default data with zero values 
  weather: IWeatherResponse = {} as IWeatherResponse;

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
          // TODO: Call weather api
          this._weatherService
            .getWeather(coord[0], coord[1])
            .subscribe((res) => {
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
