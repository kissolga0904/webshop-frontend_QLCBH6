import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { CartService } from '../../services/cart.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

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
  filename?: string;
  quantity: number;
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

  constructor(private cartService: CartService, private errorHandlerService: ErrorHandlerService) {}

  ngOnInit() {
    this.fetchCartItems();
  }

  fetchCartItems() {
    this.cartService.getCart().subscribe(
      this.errorHandlerService.buildSubscribeHandler<CartItem[]>(
      items => {
      this.cartItems = items;
      this.calculateTotal();
    }));
  }

  calculateTotal() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.total = this.subtotal + this.shipping;
    this.subtotal = parseFloat(this.subtotal.toFixed(2));
    this.total = parseFloat(this.total.toFixed(2));
  }

  increaseQuantity(item: CartItem) {
    const newQuantity = item.quantity + 1;
    
    // Check if new quantity exceeds the available stock
    if (newQuantity > item.product.quantity) {
      alert(`Sorry, only ${item.product.quantity} left in stock!`);
      return;
    }
  
    // If the quantity is within stock limits, update cart quantity
    this.cartService.updateCartQuantity(item.product.id, newQuantity)
      .subscribe(() => this.fetchCartItems());
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      this.cartService.updateCartQuantity(item.product.id, newQuantity)
        .subscribe(() => this.fetchCartItems());
    }
  }

  removeItem(item: CartItem) {
    const productId = item.product.id;
    console.log("Deleting product with ID:", productId);
    this.cartService.deleteFromCart(productId)
      .subscribe(() => this.fetchCartItems(),
                 error => console.log("Error deleting product:", error));
  }
}
