

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';



// Define interfaces here
export interface ApiResponse {
  status: string;
  data?: any;
  message?: string;
}

// export interface LoginResponse extends ApiResponse {
//   data: {
//     token: string;
//   };
// }

export interface LoginResponse extends ApiResponse {
  data: {
    token: string;
    user: { id: number, role: string, fname: string, lname: string, email: string };
  };
}

// export interface ProfileResponse extends ApiResponse {
//   data: {
//     user: {
//       id: number;
//       fname: string;
//       lname: string;
//       email: string;
//     };
//   };
// }


export interface ProfileResponse extends ApiResponse {
  data: {
    user: { id: number, role: string, fname: string, lname: string, email: string };
  };
}




@Injectable({
  providedIn: 'root'
})










export class AuthService {
  private API_URL = 'http://localhost:8888/api/v1/auth';

  
  private tokenKey: string = 'authToken';

  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());
  authState$ = this.authState.asObservable();
  
  
  // public currentUser?: { id: number, fname: string, lname: string, email: string };
  // public authToken?: string;
  // public loginState?: boolean;

  public currentUser?: { id: number, role: string, fname: string, lname: string, email: string };
  public authToken?: string;
  public loginState?: boolean;

  constructor(private _http: HttpClient, private router: Router) { }

  private _saveToStorage(key: string, value: any){
    localStorage.setItem(key, value);
  }

  saveAuthToken(): void{
    this._saveToStorage(this.tokenKey, this.authToken);
    this.authState.next(true);
  }

  isLoggedIn(): boolean{
    let token = localStorage.getItem(this.tokenKey);
    return token != null && token.length > 0;
  }

  getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : null;
  }


  getCurrentUserFirstName(): string | null {
    return this.currentUser ? this.currentUser.fname : null;
  }

  getCurrentUserLastName(): string | null {
    return this.currentUser ? this.currentUser.lname : null;
  }

  getCurrentUserEmail(): string | null {
    return this.currentUser ? this.currentUser.email : null;
  }

  getProfile(): Observable<ProfileResponse> {
    return this._http.get<ProfileResponse>(this.API_URL + '/my-profile')
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }

  getAllUsers(): Observable<ApiResponse> {
    return this._http.get<ApiResponse>(this.API_URL + '/all-users')
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }

  login(data: any): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(this.API_URL + '/login', data)
      .pipe(
        map((res) => {
          if (res.status === 'success') {
            this.authToken = res.data.token;

            //new under here
            this.currentUser = res.data.user;
            //new up there

            this.saveAuthToken();
            this.router.navigate(['/']);  // Redirect after login
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  register(data: any): Observable<ApiResponse> {
    return this._http.post<ApiResponse>(this.API_URL + '/register', data)
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }





  // logout(){
  //   localStorage.removeItem(this.tokenKey);
  // }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.authState.next(false);
    this.authToken = undefined;
    this.currentUser = undefined;
    this.router.navigate(['/login']);  // Redirect to the login page
  }

  private handleError(error: any): Observable<never> {
    return throwError(error);
  }


  //new shit under here

  getOrdersByUser(userId: number): Observable<any[]> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.get<any[]>(`${this.API_URL}/user/${userId}`, { headers })
    .pipe(
      map((res: any) => {
        if (res.status === 'success') {
          return res.data.orders; // Extract orders from the response
        } else {
          throw new Error(res.message || 'Failed to fetch orders');
        }
      }),
      catchError(this.handleError)
    );
  }


  // getCurrentUser(cb?: () => void) {
  //   this.getProfile().subscribe((res) => {
  //     if (res.status === 'success') {
  //       this.currentUser = {
  //         id: res.data.user.id,
  //         fname: res.data.user.fname,
  //         lname: res.data.user.lname,
  //         email: res.data.user.email
  //       };
  //       if (cb) cb();
  //     }
  //   });
  // }

  getCurrentUser(cb?: () => void) {
    this.getProfile().subscribe((res) => {
      if (res.status === 'success') {
        this.currentUser = {
          id: res.data.user.id,
          role: res.data.user.role,
          fname: res.data.user.fname,
          lname: res.data.user.lname,
          email: res.data.user.email
        };
        if (cb) cb();
      }
    });
  }

  getCurrentUserId(): number | null {
    return this.currentUser ? this.currentUser.id : null;
  }




  getUserById(id: string): Observable<ApiResponse> {
    return this._http.get<ApiResponse>(`${this.API_URL}/${id}`)
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }
  
  updateUser(id: string, data: any): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(`${this.API_URL}/update-user/${id}`, data)
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }
  
  deleteUser(id: string): Observable<ApiResponse> {
    return this._http.delete<ApiResponse>(`${this.API_URL}/delete-user/${id}`)
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }

}
