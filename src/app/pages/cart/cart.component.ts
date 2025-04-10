import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

interface CartItem {
  id: number;
  price: number;
  quantity: number;
  product: Product;
}

interface Product{
  id: number,
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-cart',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  shipping: number = 8;
  total: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCartItems();
  }

  fetchCartItems() {
    this.http.get<CartItem[]>('http://localhost:8080/api/cart/get') 
      .subscribe(items => {
        this.cartItems = items;
        console.log(this.cartItems); 
        this.calculateTotal();
      });
  }

  calculateTotal() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.total = this.subtotal + this.shipping;
    this.subtotal = parseFloat(this.subtotal.toFixed(2));
    this.total = parseFloat(this.total.toFixed(2));
  }

  increaseQuantity(item: CartItem) {
    item.quantity++;
    this.calculateTotal();
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotal();
    }
  }

  removeItem(id: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.calculateTotal();
  }
}
