import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { gasService } from 'src/app/services/gas.service';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css']
})
export class UpdateOrderComponent implements OnInit {
  orderForm!: FormGroup;
  orderId!: number;
  gasTypes: any[] = [];
  selectedGasType: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private gasService: gasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize orderForm with form controls and validators
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      gasType: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: [{ value: '', disabled: true }, Validators.required]
    });

    // Fetch order details using order ID from route params
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderId = +id;
      this.gasService.getOrder(this.orderId).subscribe(response => {
        const order = response.data.order;
        this.orderForm.patchValue(order);
        this.calculateTotalPrice();
      });
    }

    // Load gas types
    this.loadGasTypes();

    this.orderForm.get('gasType')?.valueChanges.subscribe(value => {
      this.selectedGasType = this.gasTypes.find(gas => gas.type === value);
      this.calculateTotalPrice();
    });

    this.orderForm.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });
  }

  // Method to load gas types
  loadGasTypes(): void {
    this.gasService.getAllGas().subscribe(
      response => {
        if (response && response.data && Array.isArray(response.data.gas)) {
          this.gasTypes = response.data.gas;
          const selectedGasTypeValue = this.orderForm.get('gasType')?.value;
          this.selectedGasType = this.gasTypes.find(gas => gas.type === selectedGasTypeValue);
          this.calculateTotalPrice();
        } else {
          console.error('Invalid gas types data received:', response);
        }
      },
      error => {
        console.error('Failed to load gas types:', error);
      }
    );
  }

  // Method to calculate the total price based on selected gas type and quantity
  calculateTotalPrice(): void {
    const quantity = this.orderForm.get('quantity')?.value;
    if (this.selectedGasType && quantity) {
      const totalPrice = this.selectedGasType.price * quantity;
      this.orderForm.get('price')?.setValue(totalPrice);
    }
  }

  // Method to submit the form
  onSubmit(): void {
    if (this.orderForm.valid) {
      const updatedOrder = {
        ...this.orderForm.value,
        price: this.orderForm.get('price')?.value
      };
      this.gasService.updateOrder(this.orderId, updatedOrder).subscribe(() => {
        this.router.navigate(['/deliveries']);
      });
    }
  }
}
