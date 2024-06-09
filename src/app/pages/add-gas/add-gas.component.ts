import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { gasService } from 'src/app/services/gas.service';

// Component decorator with metadata
@Component({
  selector: 'app-add-gas',
  templateUrl: './add-gas.component.html',
  styleUrls: ['./add-gas.component.css']
})

export class AddGasComponent implements OnInit {
  type: string = '';
  price: number = 0;
  img: File | null = null;

  constructor(private gasService: gasService, private router: Router) {}

  ngOnInit(): void {}

  // Event handler for file input change
  onFileChange(event: any): void {
    // Store the selected file
    this.img = event.target.files[0];
  }

  addgas(event: Event): void {
    // Prevent default form submission
    event.preventDefault();

    // Create a FormData object to hold form data
    const formData = new FormData();
    formData.append('type', this.type);
    formData.append('price', this.price.toString());
    
    // Append the image file if it exists
    if (this.img) {
      formData.append('img', this.img);
    }

    // Call the addGas method from the gasService and subscribe to the response
    this.gasService.addGas(formData).subscribe((res) => {
      // If the response status is 'success', 
      //reset the form and navigate to the 'all-gas' page
      if (res.status === 'success') {
        this.type = '';
        this.price = 0;
        this.img = null;
        this.router.navigateByUrl('/all-gas');
      }
    });
  }
}
