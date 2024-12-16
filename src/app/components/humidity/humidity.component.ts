import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { ITempHumidModel } from '../../models/ITempHumid.model';
import { TempHumidService } from '../../services/temp-humid.service';
import { IndexedDbService } from '../../services/indexed-db.service';

@Component({
  selector: 'app-humidity',
  standalone: true,
  imports: [MatMenu, MatIcon, CommonModule],
  templateUrl: './humidity.component.html',
  styleUrl: './humidity.component.scss',
})
export class HumidityComponent {
  tempHumidObj: ITempHumidModel = {
    id: '',
    temperature: 0,
    humidity: 0,
    time: '',
  };
  humidityUpdates: number = 0;

  constructor(
    private _tempHumidService: TempHumidService,
    private _indexedDbservice: IndexedDbService
  ) {
    this._indexedDbservice.getLatest().subscribe((latest) => {
      this.tempHumidObj = latest;
    });

    this._tempHumidService.$tempHumid.subscribe((res) => {
      this.tempHumidObj = res;
      this.humidityUpdates += 1;
    });
  }
}