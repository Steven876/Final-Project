import { Component, OnInit } from '@angular/core';
import { gasService } from 'src/app/services/gas.service';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {
  orders: any[] = [];

  constructor(private gasService: gasService) {}

  ngOnInit(): void {
    this.gasService.getAllOrders().subscribe(response => {
      this.orders = response.data.orders;
    });
  }
}
