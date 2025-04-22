import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
  email?: string;
  role: Role;
}

interface NewUser {
  username: string;
  email: string;
  password: string;  
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user/users'; 
  private deleteUrl = 'http://localhost:8080/api/user/delete';
  private addUrl ='http://localhost:8080/api/user/add';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  
  registerUser(newUser: NewUser): Observable<any> {
    return this.http.post<any>(this.addUrl, newUser);
  }
  
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.deleteUrl}/${userId}`);
  }
}
