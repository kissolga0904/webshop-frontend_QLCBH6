import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = ''; 
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private errorHandlerService: ErrorHandlerService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      cpassword: ['', Validators.required]
    },
    {
      validator: this.passwordMatchValidator
    }
  );
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password');
    const cpassword = group.get('cpassword');
    if (password && cpassword && password.value !== cpassword.value) {
      group.get('cpassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }
  

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      this.authService.registerUser({ username, email, password }).subscribe({
        next: (response) => {
          console.log('User registered:', response);
          this.toastMessage = 'Registration was successful! Redirecting to login...';
          this.showToast = true;

          setTimeout(() => {
            this.router.navigate(['/login']);
            this.showToast = false; 
          }, 2000);
        },
        error: (err) => {
          console.error('Registration failed:', err);
          this.toastMessage = 'Registration failed! Please try again.';
          this.toastType = 'error';
          this.showToast = true;
        }
      });
    }
  }
}
