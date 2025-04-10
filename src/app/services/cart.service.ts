import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart'; // Adjust as needed


  constructor(private http: HttpClient) {}

  getCart(): Observable<CartItem[]> {
    const url = `${this.apiUrl}/get`;
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  addToCart(productId: number, quantity: number) {
    const url = `${this.apiUrl}/add-product/${productId}/quantity/${quantity}`;
    return this.http.post(url, null); // or `.get()` depending on backend
  }
}
