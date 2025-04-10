import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loadingProductId: number | null = null; 

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  addToCart(productId: number, quantity: number = 1): void {
    this.cartService.addToCart(productId, quantity).subscribe({
      next: () => {
        alert('Product added to cart!');
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        alert('Could not add to cart.');
      }
    });
  }
}
