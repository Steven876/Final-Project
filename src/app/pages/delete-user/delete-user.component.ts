import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  user: any;
  isError: boolean = false;
  errMsg?: string;
  constructor( private authService: AuthService,
    private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Extract user ID from route parameters
    const userId = this.route.snapshot.paramMap.get('id');
    // Check if user ID exists
    if (userId) {
      // Call AuthService to get user details by ID
      this.authService.getUserById(userId).subscribe({
        next: (res) => {
          // Check if response is successful
          if (res.status === 'success') {
            // Assign user details to the property
            this.user = res.data.user;
          } else {
            // Set error status and message
            this.isError = true;
            this.errMsg = res.message;
          }
        },
        error: (error) => {
          // Set error status and message
          this.isError = true;
          this.errMsg = error.error.message;
        }
      });
    }
  }

  // Method to delete user
  deleteUser(): void {
    // Extract user ID from route parameters
    const userId = this.route.snapshot.paramMap.get('id');
    // Check if user ID exists
    if (userId) {
      // Call AuthService to delete user by ID
      this.authService.deleteUser(userId).subscribe({
        next: (res) => {
          // Check if deletion is successful
          if (res.status === 'success') {
            this.router.navigate(['/all-users']);
          } else {
            // Set error status and message
            this.isError = true;
            this.errMsg = res.message;
          }
        },
        error: (error) => {
          // Set error status and message
          this.isError = true;
          this.errMsg = error.error.message;
        }
      });
    }
  }
}
