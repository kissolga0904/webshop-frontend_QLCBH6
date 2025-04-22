import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { adminGuard } from '../guards/admin.guard'; // Protect the routes
import { AdminHomeComponent } from './admin-home/admin-home.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent, 
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'users', component: UsersComponent},
      { path: 'products', component: ProductsComponent},
      { path: 'orders', component: OrdersComponent}
    ]
  }
];
