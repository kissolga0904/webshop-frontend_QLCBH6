import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ShippingMethod {
  id: number;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShippingMethodService {
  private baseUrl = 'http://localhost:8080/api/shipping-methods';

  constructor(private http: HttpClient) {}

  getAllShippingMethods(): Observable<ShippingMethod[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<ShippingMethod[]>(`${this.baseUrl}/get-all`, { headers });
  }
}
