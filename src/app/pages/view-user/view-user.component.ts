import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  user: any;
  isError: boolean = false;
  errMsg?: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.authService.getUserById(userId).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.user = res.data.user;
          } else {
            this.isError = true;
            this.errMsg = res.message;
          }
        },
        error: (error) => {
          this.isError = true;
          this.errMsg = error.error.message;
        }
      });
    }
  }
}
