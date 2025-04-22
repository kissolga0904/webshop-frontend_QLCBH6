import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface OrderStatus {
  id: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService {
  private apiUrl = 'http://localhost:8080/api/order-status/get-all';

  constructor(private http: HttpClient) { }

  getOrderStatus(): Observable<OrderStatus[]> {
      const token = localStorage.getItem('jwt');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<OrderStatus[]>(this.apiUrl, { headers });
    }
}
