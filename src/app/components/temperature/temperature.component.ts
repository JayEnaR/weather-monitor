import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ITempHumidModel } from '../../models/ITempHumid.model';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { TempHumidService } from '../../services/temp-humid.service';
import { IndexedDbService } from '../../services/indexed-db.service';

@Component({
  selector: 'app-temperature',
  standalone: true,
  imports: [
    MatMenu,
    MatIcon,
    CommonModule
  ],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.scss'
})
export class TemperatureComponent {
  
   tempHumidObj : ITempHumidModel = {
    id: "",
    temperature: 0,
    humidity: 0,
    time: ""
  } ;
  temperatureUpdates : number = 0;

  constructor(private _tempHumidService: TempHumidService,
    private _indexedDbservice: IndexedDbService
  ) {

    this._indexedDbservice.getLatest().subscribe(latest => {
      this.tempHumidObj = latest;
    });

    this._tempHumidService.$tempHumid.subscribe((res) => {
      this.tempHumidObj = res;
      this.temperatureUpdates += 1;
    });
  }

}
