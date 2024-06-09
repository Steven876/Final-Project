import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { gasService } from 'src/app/services/gas.service';

@Component({
  selector: 'app-delete-gas',
  templateUrl: './delete-gas.component.html',
  styleUrls: ['./delete-gas.component.css']
})
export class DeleteGasComponent implements OnInit {
  // Property to hold gas details
  gas: any;

  constructor(private gasService: gasService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Fetch gas details when component initializes
    this.fetchGasDetails();
  }

  fetchGasDetails(): void {
    // Extract gas ID from route parameters
    const id = this.route.snapshot.params['id'];
    // Call gas service to get gas details by ID
    this.gasService.getSingleGas(id).subscribe((res) => {
      // Check if response is successful and gas details are available
      if (res.status === 'success' && res.data.gas.length > 0) {
        // Assign gas details to the property
        this.gas = res.data.gas[0];
      } else {
        console.error('Failed to fetch gas details');
      }
    }, (error) => {
      console.error('Error fetching gas details:', error);
    });
  }

  // Method to delete gas
  deleteGas(): void {
    // Check if gas object or ID is not properly initialized
    if (!this.gas || !this.gas.id) {
      console.error('Gas object is not properly initialized');
      return;
    }
    // Extract gas ID
    const id = this.gas.id;
    // Call gas service to delete gas by ID
    this.gasService.deleteGas(id).subscribe((res) => {
      // Check if deletion is successful
      if (res.status === 'success') {
        // Redirect to the page displaying all gas after successful deletion
        this.router.navigateByUrl('/all-gas');
      } else {
        alert('Failed to delete gas');
      }
    }, (error) => {
      console.error('Error deleting gas:', error);
    });
  }
}
