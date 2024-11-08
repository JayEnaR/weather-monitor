import { Component } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatMenu, MatIcon],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
