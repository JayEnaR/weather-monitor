import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientStatusService {

  private clientStatus = new Subject<boolean>();
  status$: Observable<boolean>;

  updateStatus(status: boolean):void{
    this.clientStatus.next(status);
  }

  constructor() {
    this.status$ = this.clientStatus.asObservable();
   }
}
