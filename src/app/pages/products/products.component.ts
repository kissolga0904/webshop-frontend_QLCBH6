import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CartItem, CartService } from '../../services/cart.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loadingProductId: number | null = null; 

  constructor(private productService: ProductService, private cartService: CartService, private errorHandlerService: ErrorHandlerService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      this.errorHandlerService.buildSubscribeHandler<Product[]>(
        (data: Product[]) => {
          this.products = data;
    }));
  }

  addToCart(productId: number, quantity: number = 1): void {
    if (!this.authService.isLoggedIn()) {
      alert('You must be logged in to add items to the cart.');
      this.router.navigate(['/login']); 
      return;
    }
  
    this.cartService.addToCart(productId, quantity).subscribe(
      this.errorHandlerService.buildSubscribeHandler<any>(
        () => alert("Added to cart!")
      )
    );
  }

}
