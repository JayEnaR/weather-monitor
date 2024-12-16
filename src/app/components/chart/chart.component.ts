import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ApexOptions,
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';
import { ConfigService } from '../../services/config.service';
import { IndexedDbService } from '../../services/indexed-db.service';
import { Time } from '../../helpers/time';

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

  private intervals: number;
  private tempArr: number[] = [];
  private humidArr: number[] = [];
  private seriesArr: string[] = [];

  public chartOptions: ApexOptions;

  constructor(
    private _configService: ConfigService,
    private _indexeDbService: IndexedDbService
  ) {
    this.intervals = this._configService.config.chartSeriesIntervals;

    this.chartOptions = {
      yaxis: {
        tickAmount: 4,
      },
      series: [],
      chart: { type: 'area', height: '400px' },
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

    this._indexeDbService.getAllItems().then((res) => {
      // Translate this array to the 2 arrays that display temp and humid
      res.forEach((i) => {
        this.humidArr.push(i.humidity), this.tempArr.push(i.temperature);
      });
      this.chartOptions.series = [
        { data: this.tempArr, name: 'Temperature' },
        { data: this.humidArr, name: 'Humidity' },
      ];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const temp = changes['temperature'];
    const humid = changes['humidity'];
    if (temp || humid) {
      this.updateChart(temp?.currentValue, humid?.currentValue);
    }
  }

  updateChart(temp?: number, humid?: number): void {
    // const time = Time.getTime();
    //   this.seriesArr.push(time);
    //   this.tempArr.push(
    //     temp ?? this.tempArr[this.humidArr.length - 1]
    //   );
    //   this.humidArr.push(
    //     humid ?? this.humidArr[this.humidArr.length - 1]
    //   );
    //   // We only want to see x intervals
    //   if (this.tempArr.length == this.intervals + 1) {
    //     this.tempArr.shift();
    //     this.humidArr.shift();
    //   }
    //   this.chartOptions.series = [
    //     { data: this.tempArr, name: 'Temperature' },
    //     { data: this.humidArr, name: 'Humidity' },
    //   ];
    //   this.chartOptions.xaxis!.categories = this.seriesArr;
  }
}
