import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  filename?: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products/get-all'; 
  private createProductUrl = 'http://localhost:8080/api/products/create';
  private deleteProductUrl = 'http://localhost:8080/api/products/delete/{id}';
  private modifyProductUrl = 'http://localhost:8080/api/products/modify';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<Product>(this.createProductUrl, product, {headers});

  }

  deleteProduct(id: number): Observable<any> {
    if (id === undefined || id === null) {
      console.error('Product ID is required');
      return throwError(() => new Error('Product ID is required'));
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt')}`, 
      'Content-Type': 'application/json',
    });
  
    const deleteUrl = `http://localhost:8080/api/products/delete/${id}`;
  
    return this.http.delete(deleteUrl, { headers });
  }
  

  modifyProduct(product: Product): Observable<Product> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
    });
    console.log('Token being sent:', token);  
    return this.http.put<Product>(this.modifyProductUrl, product, { headers });
}

}
