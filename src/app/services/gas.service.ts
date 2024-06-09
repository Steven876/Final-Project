import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError,tap } from 'rxjs/operators';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class gasService {
  private API_URL = 'http://localhost:8888/api/v1/gas';
  private ordersUrl = 'http://localhost:8888/api/v1/orders';

  constructor(private _http: HttpClient) {}


  private handleError(error: any): Observable<never> {
    // Handle specific error codes and messages
    return throwError(error);
  }

  getAllGas(): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/all-gas`)
      .pipe(
        map(res => res),
        catchError(this.handleError)
      );
  }


  getSingleGas(id: number): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/single-gas/${id}`).pipe(map(res => res));
  }

  addGas(info: FormData): Observable<any> {
    return this._http.post<any>(`${this.API_URL}/create-gas`, info).pipe(map(res => res));
  }

  updateGas(info: FormData, id: number): Observable<any> {
    return this._http.patch<any>(`${this.API_URL}/update-gas/${id}`, info).pipe(map(res => res));
  }


  deleteGas(id: number): Observable<any> {
    return this._http.delete<any>(`${this.API_URL}/delete-gas/${id}`).pipe(map(res => res));
  }

  placeOrder(order: any): Observable<any> {
    return this._http.post(`${this.ordersUrl}/place-order`, order);
  }


  getAllOrders(): Observable<any> {
    return this._http.get(`${this.ordersUrl}`);
  }


  getOrder(id: number): Observable<any> {
    return this._http.get<any>(`${this.ordersUrl}/${id}`)
      .pipe(
        map(res => res),
        catchError(this.handleError)
      );
  }


  updateOrder(id: number, order: any): Observable<any> {
    return this._http.patch<any>(`${this.ordersUrl}/${id}`, order)
      .pipe(
        map(res => res),
        catchError(this.handleError)
      );
  }



  deleteOrder(id: number): Observable<any> {
    return this._http.delete<any>(`${this.ordersUrl}/${id}`)
      .pipe(
        map(res => res),
        catchError(this.handleError)
      );
  }


  // getOrdersByUser(userId: number): Observable<any[]> {
  //   return this._http.get<any[]>(`${this.ordersUrl}/user/${userId}`).pipe(map(res => res), catchError(this.handleError));
  // }

  getOrdersByUser(userId: number): Observable<any[]> {
    return this._http.get<any[]>(`${this.ordersUrl}/user/${userId}`).pipe(
      tap(response => console.log('Orders response:', response)), // Log the response
      catchError(error => {
        console.error('Error fetching orders:', error);
        return throwError(error); // Rethrow the error
      })
    );
  }

  
}