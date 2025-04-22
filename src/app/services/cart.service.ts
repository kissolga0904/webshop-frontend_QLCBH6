import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  filename?: string;
  quantity: number;
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
  private apiUrl = 'http://localhost:8080/api/cart'; 
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();


  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) {}

  getCart(): Observable<CartItem[]> {
    const url = `${this.apiUrl}/get`;
    return this.http.get<CartItem[]>(url).pipe(
      tap(items => {
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCountSubject.next(totalQuantity);
      })
    );
  }

  addToCart(productId: number, quantity: number) {
    const url = `${this.apiUrl}/add-product/${productId}/quantity/${quantity}`;
    
    return this.http.post(url, null).pipe(
      tap(() => this.refreshCartCount())
    ); 
  }

  deleteFromCart(productId: number) {
    const url = `${this.apiUrl}/delete-product/${productId}`;
    console.log(`Sending DELETE request to: ${url}`);
    return this.http.delete(url).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  updateCartQuantity(productId: number, quantity: number) {
    const url = `${this.apiUrl}/modify-product/${productId}/quantity/${quantity}`;
    return this.http.put(url, null).pipe(
      tap(() => this.refreshCartCount())
    );
  }


  refreshCartCount() {
    this.getCart().subscribe(); // silently refresh the count
  }
}
