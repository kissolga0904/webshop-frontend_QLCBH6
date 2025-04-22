import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CartService } from './cart.service';

export interface PlaceOrderRequest {
  street: string;
  houseNumber: number;
  city: string;
  postalCode: number;
  country: string;
  paymentMethodId: number;
  shippingMethodId: number;
}

interface Status {
  id: number;
  status: string;
}

interface ShippingMethod {
  id: number;
  name: string;
  price: number;
}

interface PaymentMethod {
  id: number;
  name: string;
}

interface Address {
  id: number;
  street: string;
  houseNumber: number;
  city: string;
  postalCode: number;
  country: string | null;
}

interface ShoppingCart {
  id: number;
}

export interface Order {
  id: number;
  orderDate: string;
  status: Status;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  address: Address;
  shoppingCart: ShoppingCart;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/order/get-all'; 
  private placeOrderUrl = 'http://localhost:8080/api/order/place';
  private clearCartUrl = 'http://localhost:8080/api/cart/clear';
  private deleteOrderUrl = 'http://localhost:8080/api/order/delete';
  private modifyStatusUrl ='http://localhost:8080/api/order/change-status/{oid}/status/{sid}';

  constructor(private http: HttpClient, private cartService: CartService) {}

  placeOrder(request: PlaceOrderRequest): Observable<void> {
    const token = localStorage.getItem('jwt');
    console.log('JWT Token:', token); // Check the token value
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json',
    });
  return this.http.post<void>(this.placeOrderUrl, request, { headers });
  }

  clearCart(): Observable<void>{
    return this.http.post<void>(this.clearCartUrl, {}).pipe(
      tap(() => {
        this.cartService.refreshCartCount();
      })
    );
  }

  getOrders(): Observable<Order[]> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Order[]>(this.apiUrl, { headers });
  }

  deleteOrder(orderId: number): Observable<void> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${this.deleteOrderUrl}/${orderId}`, { headers } );
  }

  modifyStatus(orderId: number, statusId:number): Observable<void>{
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<void>(this.modifyStatusUrl.replace("{oid}", orderId.toString()).replace("{sid}", statusId.toString()), {},  { headers });
  }

}
