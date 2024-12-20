import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { ITempHumidModel } from '../../models/ITempHumid.model';
import { TempHumidService } from '../../services/temp-humid.service';
import { IndexedDbService } from '../../services/indexed-db.service';
import { ClientStatusService } from '../../services/client-status.service';
import { Subject, takeUntil } from 'rxjs';

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
  $unsub: Subject<void> = new Subject<void>();

  constructor(
    private _tempHumidService: TempHumidService,
    private _indexedDbservice: IndexedDbService,
    private _clientStatusService: ClientStatusService
  ) {
    // State management
    this._indexedDbservice.getLatest().subscribe((latest) => {
      if (latest) this.tempHumidObj = latest;
    });

    this._clientStatusService.status$
      .pipe(takeUntil(this.$unsub))
      .subscribe((online) => {
        if (online) {
          this._tempHumidService.$tempHumid.subscribe((res) => {
            if(res.humidity != this.tempHumidObj.humidity){
              this.humidityUpdates += 1;
            }
            this.tempHumidObj = res;
          });
        }
      });
  }
}
