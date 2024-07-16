import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/customers';
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();
  private headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa('admin:fakepassword')
  });

  constructor(private http: HttpClient) {}

  fetchItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => response)
    );
  }

  getCustomerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.headers }).pipe(
      map(response => response)
    );
  }

  addCustomer(customer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, customer, { headers: this.headers }).pipe(
      map(response => response)
    );
  }

  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, customer, { headers: this.headers }).pipe(
      map(response => response)
    );
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.headers }).pipe(
      map(response => response)
    );
  }

  addToCart(item: any) {
    const currentCart = this.cartSubject.value;
    this.cartSubject.next([...currentCart, item]);
  }

  removeFromCart(item: any) {
    const currentCart = this.cartSubject.value;
    this.cartSubject.next(currentCart.filter(i => i !== item));
  }
}
