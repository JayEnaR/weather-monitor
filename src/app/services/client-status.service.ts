import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientStatusService {

  private clientStatus = new BehaviorSubject<boolean>(false);
  status$: Observable<boolean>;

  constructor() {
    this.status$ = this.clientStatus.asObservable();
  }

  updateStatus(status: boolean):void{
    this.clientStatus.next(status);
  }
}
