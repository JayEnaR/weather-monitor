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

  private chartSeriesIntervals: number = 10;
  private tempArr: number[] = [];
  private humidArr: number[] = [];
  private seriesArr: string[] = [];

  public chartOptions: ApexOptions;

  constructor() {
    this.chartOptions = {
      series: [
      ],
      chart: { type: 'area' },
      xaxis: {
        categories: [],
      },
      title: {
        offsetX: 15,
        offsetY: 10,
        text: 'Fluctuation',
        style: { fontSize: '18px', fontFamily: 'Roboto', fontWeight: '500' },
      },
      colors: ['#3b82f6', '#f59e0b'],
    };
  }

  getTime(): string {
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return formattedTime;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const temp = changes['temperature'];
    const humid = changes['humidity'];
    
    if (temp || humid) {
      const time = this.getTime();

      this.seriesArr.push(time);

      this.tempArr.push(
        temp?.currentValue ?? this.tempArr[this.humidArr.length - 1]
      );
      this.humidArr.push(
        humid?.currentValue ?? this.humidArr[this.humidArr.length - 1]
      );
      
      // We only want to see 15 intervals
      if (this.tempArr.length == this.chartSeriesIntervals + 1) {
        this.tempArr.shift();
        this.humidArr.shift();
      }
      
      this.chartOptions.series = [
        { data: this.tempArr, name: "Temperature" },
        { data: this.humidArr, name: "Humidity" }, 
      ];

      this.chartOptions.xaxis!.categories = this.seriesArr
    }
  }
}
