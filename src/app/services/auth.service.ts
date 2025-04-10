import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';



export interface RegistrationData{
  username: string;
  email: string;
  password: string;
}

export interface AuthenticationData{
  username: string;
  password: string;
}

interface JwtPayload {
  username?: string;
  sub?: string; 
  [key: string]: any; 
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:8080/api/user/registration';
  private loginUrl = 'http://localhost:8080/api/auth/authenticate';
  private token = '';
  private username: string |null = null;
  
  constructor(private http: HttpClient) { 
    const localStorageToken = localStorage.getItem('jwt');
    if(localStorageToken !== null){
      this.token = localStorageToken;
    }

    const localStorageUsername = localStorage.getItem('username');
    if (localStorageUsername) this.username = localStorageUsername;
  }

  saveToken(token: string){
    this.token = token;
    localStorage.setItem('jwt', token);
  }

  setUsername(name: string) {
    console.log('Setting username:', name); 
    this.username = name;
    localStorage.setItem('username', name);
  }

  getUsername():string |null{
    return this.username;
  }

  isLoggedIn(){
    if(this.token !== null && this.token !== ''){
      return true;
    }
    return false;
  }

  getToken(){
    return this.token;
  }

  logOut(){
    this.token = '';
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  registerUser(data: RegistrationData): Observable<any>{
    return this.http.post(this.apiUrl, data);
  }

  loginUser(data: AuthenticationData): Observable<any>{
    return this.http.post(this.loginUrl, data);
  }

}

