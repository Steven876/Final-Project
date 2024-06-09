import { Component, OnInit } from '@angular/core';
import { gasService } from 'src/app/services/gas.service';

// Component decorator with metadata
@Component({
  selector: 'app-all-gas',
  templateUrl: './all-gas.component.html',
  styleUrls: ['./all-gas.component.css']
})

export class AllGasComponent implements OnInit {
  // Property to hold gas data
  gas: any[] = [];
  
  // Properties to handle error state and message
  isError: boolean = false;
  errMsg?: string;

  constructor(private gasService: gasService) {}

  ngOnInit(): void {
    // Call the fetchGas method when the component initializes
    this.fetchGas();
  }

  // Method to fetch gas data
  fetchGas(): void {
    this.gasService.getAllGas().subscribe({
      // Next callback to handle successful response
      next: (res) => {
        // Reset error state
        this.isError = false;
        if (res.status === 'success') {
          this.gas = res.data.gas;
        }
      },
      // Error callback to handle errors
      error: (error) => {
        // Set error state to true and store error message
        this.isError = true;
        this.errMsg = error.error.message;
        // Log the error details
        console.error(this.errMsg);
        console.error(error.error);
        console.error(this.isError);
      },
      // Complete callback (optional)
      complete: () => {}
    });
  }
}
