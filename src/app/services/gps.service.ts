import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GpsService {

  $gpsSearching: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor() { }

}
