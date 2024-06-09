import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

// Component decorator with metadata
@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})

export class AllUsersComponent implements OnInit {

  constructor(private authService: AuthService){ }

  ngOnInit(): void {
    // Call the fetchUsers method when the component initializes
    this.fetchUsers();   
  }

  users: any = [];
  isError: boolean = false;
  errMsg?: string;

  fetchUsers(): void {
    const userSub = this.authService.getAllUsers().subscribe({ 
      // Next callback to handle successful response
      next: (res) => {
        // Reset error state
        this.isError = false;
        // If the response status is 'success', update the users 
        //array with the retrieved data
        if (res['status'] == 'success') {
          this.users = res['data'] ['users'];
        }
      },
      // Error callback to handle errors
      error: (error) => {
        // Set error state to true and store error message
        this.isError = true;
        this.errMsg = error.error.message;
        // Log the error details
        console.log(this.errMsg);
        console.log(error.error);
        console.log(this.isError);
      },
      // Complete callback (optional)
      complete: () => {}
    });
  }
}
