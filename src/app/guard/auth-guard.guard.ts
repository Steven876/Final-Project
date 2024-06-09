import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Injectable decorator marks this class as available to be provided and injected as a dependency
@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  // Constructor with dependency injection for Router and AuthService
  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  // canActivate method to determine if the route can be activated
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Get the current user from the AuthService
    const currentUser = this.authService.currentUser;
    
    // Get the expected role from the route data
    const expectedRole = route.data['expectedRole'];
    
    // If there's no current user, redirect to the login page
    if (!currentUser) {
      return this.router.createUrlTree(['/login']);
    }
    
    // If there's an expected role and it doesn't match the current user's role, redirect to the home page
    if (expectedRole && expectedRole !== currentUser.role) {
      return this.router.createUrlTree(['/home']);
    }
    
    // If the user is authenticated and the role matches (if applicable), allow access
    return true;
  }
}
