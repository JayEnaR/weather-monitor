import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IWeatherResponse } from '../models/weather-response.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private appId: string = 'e6d6281213401bcb5b3c43d3534e1c72';
  
  constructor(
    private _httpClient: HttpClient,
    private _configService: ConfigService
  ) {}

  getWeather(lat: string, long: string): Observable<IWeatherResponse> {
    return this._httpClient.get<IWeatherResponse>(
      `${this._configService.config.weatherApiUrl}?lat=${lat}&lon=${long}&appid=${this.appId}&units=metric`
    );
  }
}
