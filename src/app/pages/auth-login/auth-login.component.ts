import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { gasService } from 'src/app/services/gas.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnDestroy {
  // Properties to handle error state and message
  hasError?: boolean;
  errMsg?: string;
  
  // Property to hold gases data
  gases: any[] = [];
  
  // Properties to manage slider state
  currentSlide: number = 0;
  autoSlideInterval: any;

  // Constructor with dependency injection for authService, gasService, and router
  constructor(
    private authService: AuthService,
    private gasService: gasService,
    private router: Router
  ) {
    // Load gases data and start auto slide when the component initializes
    this.loadGases();
    this.startAutoSlide();
  }

  // Method to load gases data
  loadGases(): void {
    // Subscribe to getAllGas method of gasService
    this.gasService.getAllGas().subscribe(response => {
      // Map gas data and handle image URLs
      this.gases = response.data.gas.map((g: any) => ({
        ...g,
        img: g.img ? `http://localhost:8888/uploads/${g.img}` : 'assets/images/default.jpg'
      }));
    });
  }

  // Getter method to calculate slider transformation
  get sliderTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  // Method to navigate to next slide
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.gases.length;
  }

  // Method to navigate to previous slide
  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.gases.length) % this.gases.length;
  }

  // Method to start auto slide
  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000); // Change slide every 3 seconds
  }

  // Method to stop auto slide
  stopAutoSlide(): void {
    clearInterval(this.autoSlideInterval);
  }

  // OnDestroy lifecycle hook to stop auto slide when the component is destroyed
  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  // Method to handle login form submission
  onLogin2(loginForm: NgForm): void {
    // Subscribe to login method of authService
    this.authService.login(loginForm.value).subscribe({
      // Next callback to handle successful login
      next: (loginRes) => {
        // If login status is 'success', update authentication token and navigate to home page
        if (loginRes['status'] === 'success') {
          this.hasError = false;
          this.authService.authToken = loginRes['data']!['token'];
          this.authService.saveAuthToken();
          this.authService.getCurrentUser(() => {
            this.authService.loginState = true;
          });
          this.router.navigateByUrl('/home');
        }
      },
      // Error callback to handle login errors
      error: (error) => {
        // Set error state and message, and update login state
        this.hasError = true;
        this.errMsg = error.error['message'];
        this.authService.loginState = false;
      }
    });
  }
}
