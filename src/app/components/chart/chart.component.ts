import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ApexOptions,
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnChanges {
  @Input() temperature: number = 0;
  @Input() humidity: number = 0;

  private tempArr: number[] = [];
  private humidArr: number[] = [];

  public chartOptions: ApexOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Temperature',
          data: [],
        },
        {
          name: 'Humidity',
          data: [],
        },
      ],
      chart: { type: 'area' },
      xaxis: {},
      title: { text: 'Fluctuation', style: { fontSize: '18px', fontFamily: 'Roboto', fontWeight: '500' } },
      colors: ['#3b82f6', '#f59e0b'],
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    const temp = changes['temperature'];
    const humid = changes['humidity'];
    if (temp || humid) {
      this.tempArr.push(
        temp?.currentValue ?? this.tempArr[this.humidArr.length - 1]
      );
      this.humidArr.push(
        humid?.currentValue ?? this.humidArr[this.humidArr.length - 1]
      );
      this.chartOptions.series = [
        { data: this.tempArr },
        { data: this.humidArr },
      ];
    }
  }
}
