import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  filename?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products/find-random-products'; 
  private createProductUrl = 'http://localhost:8080/api/products/create';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt')}`, // minden vedett vegpontnal
      'Content-Type': 'application/json',
    });
    return this.http.post<Product>(this.createProductUrl, product, {headers});

  }
}
