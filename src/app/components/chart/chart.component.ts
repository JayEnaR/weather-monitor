import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts';
import { ConfigService } from '../../services/config.service';
import { IndexedDbService } from '../../services/indexed-db.service';
import { TempHumidService } from '../../services/temp-humid.service';
import { ITempHumidModel } from '../../models/ITempHumid.model';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements AfterViewInit {
  private intervals: number;
  private tempArr: number[] = [];
  private humidArr: number[] = [];
  private seriesArr: string[] = [];
  public chartOptions: ApexOptions;
  @ViewChild('chart') chart!: ApexCharts;

  constructor(
    private _configService: ConfigService,
    private _indexeDbService: IndexedDbService,
    private _tempHumidService: TempHumidService
  ) {
    this.intervals = this._configService.config.chartSeriesIntervals;

    this.chartOptions = {
      yaxis: {
        tickAmount: 4,
      },
      series: [],
      chart: { type: 'area', height: '400px' },
      xaxis: {
        categories: [], // Needed for time value. When chart updates it scrolls to top
      },
      title: {
        offsetX: 15,
        offsetY: 10,
        text: 'Fluctuation',
        style: { fontSize: '18px', fontFamily: 'Roboto', fontWeight: '500' },
      },
      colors: ['#3b82f6', '#f59e0b'],
    };

    // State management
    this._indexeDbService.getAllItems().subscribe((res) => {
      // Split the res array into temp and hmid
      res = this.orderByTime(res);
      console.table(res);

      res.forEach((i) => {
        this.humidArr.push(i.humidity),
          this.tempArr.push(i.temperature),
          this.seriesArr.push(i.time);
      });
      this.chartOptions.series = [
        { data: this.tempArr, name: 'Temperature' },
        { data: this.humidArr, name: 'Humidity' },
      ];
      this.chartOptions.xaxis!.categories = this.seriesArr;
      this.chart.updateOptions({
        xaxis: {
          categories: this.seriesArr,
        },
      });
    });

    // Temp and Humid Subscription
    this._tempHumidService.$tempHumid.subscribe((res) => {
      this.updateChart(res);
    });
  }

  ngAfterViewInit(): void {
    // this.chart = new ApexCharts(
    //   document.querySelector('#chart'),
    //   this.chartOptions
    // );
  }

  orderByTime(res: ITempHumidModel[]): ITempHumidModel[] {
    return res.sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);

      const totalSecondsA = timeA[0] * 3600 + timeA[1] * 60 + timeA[2];
      const totalSecondsB = timeB[0] * 3600 + timeB[1] * 60 + timeB[2];

      return totalSecondsA - totalSecondsB;
    });
  }

  updateChart(data: ITempHumidModel): void {
    this.seriesArr.push(data.time);
    this.tempArr.push(
      data.temperature ?? this.tempArr[this.humidArr.length - 1]
    );
    this.humidArr.push(
      data.humidity ?? this.humidArr[this.humidArr.length - 1]
    );
    // We only want to see x intervals
    if (this.tempArr.length >= this.intervals + 1) {
      this.tempArr.shift();
      this.humidArr.shift();
      this.seriesArr.shift();
    }
    this.chartOptions.series = [
      { data: this.tempArr, name: 'Temperature' },
      { data: this.humidArr, name: 'Humidity' },
    ];
    this.chartOptions.xaxis!.categories = this.seriesArr;
    this.chart.updateOptions({
      xaxis: {
        categories: this.seriesArr,
      },
    });
  }
}
