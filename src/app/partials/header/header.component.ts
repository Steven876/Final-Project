import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      this.authService.logout();
    }
  }

}
