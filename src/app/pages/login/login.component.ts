import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { AuthenticationData, AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthService,
    private router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return; 
    }

    const loginData: AuthenticationData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authenticationService.loginUser(loginData).subscribe({
      next: (response) => {
        console.log(response);
        if (response && response.jwt) {
          this.authenticationService.saveToken(response.jwt);
          this.authenticationService.setUsername(response.username || response.email);
        }
        localStorage.setItem('role', response.role);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Login failed', err);
        if (err.status === 401) {
          alert('Incorrect username or password. Please try again.');
        } else {
          alert('An error occurred. Please try again later.');
        }
      }
    });
  }
}
