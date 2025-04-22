import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observer } from 'rxjs/internal/types';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private router: Router) { }

  buildSubscribeHandler<T>(next:(data: T) => void): Partial<Observer<T>>{
    return {
      next: next,
      error: (err: any) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    }
  }
}
