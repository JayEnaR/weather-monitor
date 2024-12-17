import { Component } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { CommonModule } from '@angular/common';
import { WeatherComponent } from '../weather/weather.component';
import { HumidityComponent } from '../humidity/humidity.component';
import { TemperatureComponent } from '../temperature/temperature.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartComponent,
    CommonModule,
    WeatherComponent,
    HumidityComponent,
    TemperatureComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent  {

}
