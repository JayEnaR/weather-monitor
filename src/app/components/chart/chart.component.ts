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
import { Time } from '../../helpers/time';
import { TempHumidService } from '../../services/temp-humid.service';

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

    // TODO: Only get idexedDb items if device is online
    
    // State management
    this._indexeDbService.getAllItems().subscribe((res) => {
      // Split the res array into temp and hmid
      res = res.sort((a, b) => +a.id - +b.id);
      res.forEach((i) => {
        this.humidArr.push(i.humidity), this.tempArr.push(i.temperature), this.seriesArr.push(i.time);
      });
      this.chartOptions.series = [
        { data: this.tempArr, name: 'Temperature' },
        { data: this.humidArr, name: 'Humidity' },
      ];
      this.chartOptions.xaxis!.categories = this.seriesArr;
      console.table(res)
    });

    // Temp and Humid Subscription
    this._tempHumidService.$tempHumid.subscribe((res) => {
      // this.updateChart(res.temperature, res.humidity);
    });
  }

  ngAfterViewInit(): void {
    // this.chart = new ApexCharts(
    //   document.querySelector('#chart'),
    //   this.chartOptions
    // );
  }

  updateChart(temp?: number, humid?: number): void {
    const time = Time.getTime();
    this.seriesArr.push(time);
    // TODO: Display time
    // this.chartOptions.xaxis!.categories = this.seriesArr;

    this.tempArr.push(temp ?? this.tempArr[this.humidArr.length - 1]);
    this.humidArr.push(humid ?? this.humidArr[this.humidArr.length - 1]);
    // We only want to see x intervals
    if (this.tempArr.length >= this.intervals + 1) {
      this.tempArr.shift();
      this.humidArr.shift();
    }
    this.chartOptions.series = [
      { data: this.tempArr, name: 'Temperature' },
      { data: this.humidArr, name: 'Humidity' },
    ];

    this.chart.updateOptions({
      xaxis: {
        categories: this.seriesArr,
      },
    });
  }
}
