import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { liveQuery } from 'dexie';
import { ITempHumidModel } from '../models/ITempHumid.model';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService extends Dexie {
  tableCtx!: Dexie.Table<ITempHumidModel, string>;
  table$ = liveQuery(() => this.tableCtx.toArray());

  constructor() {
    super('tempHumid');
    this.version(1).stores({
      tableCtx: 'id,temperature,humidity',
    });
  }

  add(record: ITempHumidModel): void {
    this.tableCtx.add(record, record.id);  
  }

  removeLast(): void {}
}
