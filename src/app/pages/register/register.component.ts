import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
  }
  hasError?: boolean;
  errMsg?: string;

  onRegister(registerForm: NgForm){
    const addUser = this.authService.register(registerForm.value).subscribe({
      next: (registerRes) => {
        console.log(`registerRes>> ${registerRes}`);
        if (registerRes.status === 'success' && registerRes.data && registerRes.data.token) {
          this.hasError = false;
          this.authService.authToken = registerRes.data.token;
          this.authService.saveAuthToken();
          this.authService.getCurrentUser(() => {
            this.authService.loginState = true;
          });
          this.router.navigateByUrl('/');
        } else {
          this.hasError = true;
          this.errMsg = registerRes.message || 'Unexpected error during registration';
          this.authService.loginState = false;
        }
      },
      error: (error) => {
        console.log(error.error.message);
        this.hasError = true;
        this.errMsg = error.error.message || 'Unexpected error during registration';
        this.authService.loginState = false;
      }
    });
  }
}

