import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { liveQuery } from 'dexie';
import { ITempHumidModel } from '../models/ITempHumid.model';
import { first, from, map, Observable } from 'rxjs';

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

  add(record: ITempHumidModel): Observable<any> {
    console.log('Added key ', record.id);
    return from(this.tableCtx.add(record, record.id));
  }

  getAllItems(): Observable<ITempHumidModel[]> {
    const collection = this.tableCtx.toCollection();
    return from(collection.toArray());
  }

  getRowCount(): Observable<number> {
    return from(this.tableCtx.count());
  }

  removeFirst(): void {
    const collection = this.tableCtx.toCollection();
    collection.sortBy('time').then((res) => {
      this.tableCtx.delete(res[0].id);
    });
  }

  getLatest(): Observable<ITempHumidModel> {
    const collection = this.tableCtx.toCollection();
    return from(collection.sortBy('time')).pipe(
      map((table) => table[table.length - 1])
    );
  }

  clearDb(): void {
    this.tableCtx.clear();
  }
}
