import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartItem, CartService } from '../../services/cart.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  username: string | null = null;
  cartCount: number= 0;
  isAdmin: boolean;

  constructor(public authenticationService: AuthService, private cartService: CartService, private errorHandlerService: ErrorHandlerService){
    this.isAdmin = this.authenticationService.isAdmin();
  }


  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    console.log('Username from localStorage:', this.username); 

    this.cartService.cartCount$.subscribe(
      this.errorHandlerService.buildSubscribeHandler<number>(
      (count) => {
      this.cartCount = count;
    }));

    this.cartService.refreshCartCount();
  }

  getUsername(){
    return localStorage.getItem('username');
  }

  isLoggedIn(){
    return this.authenticationService.isLoggedIn();
  }

  logOut(){
    return this.authenticationService.logOut();
  }



}
