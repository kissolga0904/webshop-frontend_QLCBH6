import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('/api/admin/users');
  }

  addProduct(product: any): Observable<any> {
    return this.http.post('/api/admin/products', product);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>('/api/admin/orders');
  }
}

