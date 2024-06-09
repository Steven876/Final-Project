import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  user: any;
  isError: boolean = false;
  errMsg?: string;

  constructor(
    private authService: AuthService, private route: ActivatedRoute,
    private router: Router,private fb: FormBuilder) {
    // Initialize the edit user form with form controls
    this.editUserForm = this.fb.group({
      email: [''], fname: [''], lname: [''], role: ['']
    });
  }

  ngOnInit(): void {
    // Extract user ID from route parameters
    const userId = this.route.snapshot.paramMap.get('id');
    // Check if user ID exists
    if (userId) {
      // Call AuthService to get user details by ID
      this.authService.getUserById(userId).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.user = res.data.user;
            // Populate the form with user data
            this.editUserForm.patchValue(this.user);
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

  // Method to handle form submission
  onSubmit(): void {
    // Extract user ID from route parameters
    const userId = this.route.snapshot.paramMap.get('id');
    // Check if user ID exists
    if (userId) {
      // Call AuthService to update user with the edited data
      this.authService.updateUser(userId, this.editUserForm.value).subscribe({
        next: (res) => {
          // Check if update is successful
          if (res.status === 'success') {
            // Redirect to the page displaying all users after successful update
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
