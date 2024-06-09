import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { gasService } from 'src/app/services/gas.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {
  // Array to hold selected gases
  selectedGases: any[] = [];
  // Property to hold gas details
  gas: any;
  // Properties to hold user details, phone, and location
  currentUserFirstName: string = '';
  currentUserLastName: string = '';
  currentUserEmail: string = '';
  phone: string = '';
  location: string = '';

  // Constructor with dependency injection for gasService, Router, and AuthService
  constructor(
    private gasService: gasService,
    private router: Router,
    private authService: AuthService
  ) {
    // Initialize selectedGases array with gas from router state if available
    const navigation = this.router.getCurrentNavigation();
    this.gas = navigation?.extras.state?.['gas'];
    if (this.gas) {
      this.selectedGases.push({ ...this.gas, quantity: 1 });
    }
  }

  // OnInit lifecycle hook
  ngOnInit(): void {
    // Fetch current user details from AuthService
    this.authService.getCurrentUser(() => {
      this.currentUserFirstName = this.authService.getCurrentUserFirstName() || '';
      this.currentUserLastName = this.authService.getCurrentUserLastName() || '';
      this.currentUserEmail = this.authService.getCurrentUserEmail() || '';
    });

    // If gas details are not available, fetch all gases from gasService
    if (!this.gas) {
      this.gasService.getAllGas().subscribe(response => {
        // Initialize selectedGases array with gas data and quantity set to 1
        this.selectedGases = response.data.gas.map((g: any) => ({ ...g, quantity: 1 }));
      });
    }
  }

  // Method to update the quantity of selected gas
  updateQuantity(index: number, quantity: number): void {
    this.selectedGases[index].quantity = quantity;
  }

  // Method to place an order
  placeOrder(): void {
    // Get phone and location values from form inputs
    const phoneElement = document.getElementById('phone');
    const locationElement = document.getElementById('location');

    // Construct order details object
    const orderDetails = {
      customerName: this.currentUserFirstName + ' ' + this.currentUserLastName,
      customerEmail: this.currentUserEmail,
      gasType: this.selectedGases.map(gas => gas.type).join(', '),
      quantity: this.selectedGases.reduce((total, gas) => total + gas.quantity, 0),
      price: this.selectedGases.reduce((total, gas) => total + (gas.price * gas.quantity), 0),
      phone: phoneElement ? (phoneElement as HTMLInputElement).value : '',
      location: locationElement ? (locationElement as HTMLInputElement).value : '',
    };

    // Call gasService to place the order
    this.gasService.placeOrder(orderDetails).subscribe(response => {
      // Navigate to confirmation page with order details in router state
      this.router.navigate(['/confirmation'], { state: { order: response.data.order } });
    });
  }

  // Method to cancel the order and navigate to the home page
  cancelOrder(): void {
    this.router.navigate(['/home']);
  }
}
