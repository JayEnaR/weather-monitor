import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { ClientStatusService } from './services/client-status.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton, MatIcon, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {

  online: boolean = false;

  constructor(private _matIconReg: MatIconRegistry,
    public _clientStatusService: ClientStatusService) {

    this._matIconReg.setDefaultFontSetClass('material-symbols-outlined');

    this._clientStatusService.status$.subscribe(res => this.online = res);
  }

}
