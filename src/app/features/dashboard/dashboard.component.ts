import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly cards = [
    { title: 'Total Vehicles', value: '—' },
    { title: 'Active Routes', value: '—' },
    { title: 'Alerts', value: '—' },
    { title: 'Avg Fuel Efficiency', value: '—' },
  ];
}
