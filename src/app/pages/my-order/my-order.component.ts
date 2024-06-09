import { Component, OnInit } from '@angular/core';
import { gasService } from 'src/app/services/gas.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {
  orders: any[] = [];
  isError: boolean = false;
  errMsg?: string;

  constructor(private gasService: gasService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.authService.getCurrentUser(() => {
      const userId = this.authService.getCurrentUserId();
      if (userId !== null) {
        this.authService.getOrdersByUser(userId).subscribe(
          (orders: any[]) => {
            this.orders = orders || []; // Ensure orders is always an array
            console.log('Fetched orders:', this.orders.length); // Log the length of orders
          },
          (error: any) => {
            console.error('Error fetching orders:', error.message);
            // Handle error scenario
          }
        );
      } else {
        console.error('User ID is null');
        // Handle the case where userId is null (e.g., show an error message)
      }
    });
  }

  cancelOrder(orderId: number): void {
    this.gasService.deleteOrder(orderId).subscribe(() => {
      this.orders = this.orders.filter(order => order.id !== orderId);
    });
  }
}
