import { Component } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatMenu, MatIcon, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  public chartOptions: ApexOptions;

  constructor(){
    this.chartOptions = {
      
    }
  }
}
