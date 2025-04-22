import { Component } from '@angular/core';
import { ProductService,Product } from '../../services/product.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  products: Product[] = [];
  selectedFile: File | null = null;
  newProduct: Product = {
    name: '',
    description: '',
    price: 0,
    filename: '',
    quantity: 0
  };
  isEditing: boolean = false;  
  editingProduct: Product | null = null;  

  constructor(private productService: ProductService, private http: HttpClient, private errorHandlerService: ErrorHandlerService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      this.errorHandlerService.buildSubscribeHandler<Product[]>(
        (products) => {
      this.products = products;
    }));
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
    } else {
      console.log('No file selected');
    }
  }

  onSubmit() {
    console.log('Form Submitted');
    if (
      this.newProduct.name &&
      this.newProduct.description &&
      this.newProduct.price &&
      this.newProduct.quantity &&
      this.selectedFile
    ) {
      const reader = new FileReader();
  
      reader.onload = () => {
        const base64String = reader.result as string;
  
        const productData: Product = {
          name: this.newProduct.name,
          description: this.newProduct.description,
          price: this.newProduct.price,
          filename: base64String,
          quantity: this.newProduct.quantity 
        };

        if (this.isEditing && this.editingProduct) {
          productData.id = this.editingProduct.id;
          this.productService.modifyProduct(productData).subscribe({
            next: (updatedProduct) => {
              console.log('Product updated:', updatedProduct);
              this.loadProducts(); 
              this.resetForm(); 
            },
            error: (err) => {
              console.error('Error updating product:', err);
              alert('Failed to update product: ' + (err.error?.message || 'Unknown error'));
            },
          });
        } else {
          this.productService.addProduct(productData).subscribe({
            next: (product) => {
              console.log('Product added:', product);
              this.products.push(product); 
              this.resetForm();
            },
            error: (err) => {
              console.error('Error adding product:', err);
              alert('Failed to add product: ' + (err.error?.message || 'Unknown error'));
            },
          });
        }
      };
  
      reader.readAsDataURL(this.selectedFile); 
    } else {
      console.log('Please fill in all fields and upload an image.');
      alert('Please fill in all fields and upload an image.');
    }
  }

  resetForm() {
    this.newProduct = { name: '', description: '', price: 0, filename: '', quantity: 0 };
    this.selectedFile = null;
    this.isEditing = false;  
    this.editingProduct = null;  
  }

  editProduct(product: Product) {
    this.isEditing = true;  
    this.editingProduct = { ...product };  
    this.newProduct = { ...product };  
  }

  deleteProduct(product: Product): void {
    if (product.id !== undefined && product.id !== null) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts(); 
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Failed to delete product: ' + (err.error?.message || 'Unknown error'));
        },
      });
    } else {
      console.error('Invalid product ID');
    }
  }
}
