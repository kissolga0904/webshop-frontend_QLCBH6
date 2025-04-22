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
  isEditing: boolean = false;  // Flag to toggle between adding and editing
  editingProduct: Product | null = null;  // To hold the product being edited

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
        // Convert image to base64 string (optional — depends on your backend expectation)
        const base64String = reader.result as string;
  
        const productData: Product = {
          name: this.newProduct.name,
          description: this.newProduct.description,
          price: this.newProduct.price,
          filename: base64String,
          quantity: this.newProduct.quantity 
        };

        if (this.isEditing && this.editingProduct) {
          // If we're editing, update the product
          productData.id = this.editingProduct.id;
          this.productService.modifyProduct(productData).subscribe({
            next: (updatedProduct) => {
              console.log('Product updated:', updatedProduct);
              this.loadProducts(); // Refresh product list
              this.resetForm(); // Reset form
            },
            error: (err) => {
              console.error('Error updating product:', err);
              alert('Failed to update product: ' + (err.error?.message || 'Unknown error'));
            },
          });
        } else {
          // If we're adding a new product
          this.productService.addProduct(productData).subscribe({
            next: (product) => {
              console.log('Product added:', product);
              this.products.push(product); // Add product to table
              this.resetForm(); // Reset form
            },
            error: (err) => {
              console.error('Error adding product:', err);
              alert('Failed to add product: ' + (err.error?.message || 'Unknown error'));
            },
          });
        }
      };
  
      reader.readAsDataURL(this.selectedFile); // triggers the onload() above
    } else {
      console.log('Please fill in all fields and upload an image.');
      alert('Please fill in all fields and upload an image.');
    }
  }

  resetForm() {
    this.newProduct = { name: '', description: '', price: 0, filename: '', quantity: 0 };
    this.selectedFile = null;
    this.isEditing = false;  // Reset editing flag
    this.editingProduct = null;  // Clear the editing product
  }

  editProduct(product: Product) {
    this.isEditing = true;  // Set editing mode
    this.editingProduct = { ...product };  // Populate form with existing product data
    this.newProduct = { ...product };  // Pre-fill the form with the product data
  }

  deleteProduct(product: Product): void {
    if (product.id !== undefined && product.id !== null) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts(); // Reload products after deletion
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
