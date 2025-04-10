import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  username: string | null = null;
  constructor(public authenticationService: AuthService){
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    console.log('Username from localStorage:', this.username); 
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
