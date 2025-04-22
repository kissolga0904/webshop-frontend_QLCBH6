import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  username: string;
  email?: string;
  role: {
    id: number;
    name: string;
  };
}

interface NewUser {
  username: string;
  email: string;
  password: string;
  roleId: number; // 1 for Admin, 2 for Customer
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  newUser: NewUser ={
    username: '',
    email: '',
    password: '',
    roleId: 2,  // Default to Customer role
  };
  
  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Customer' }
  ];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId); // remove from list
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user.');
        }
      });
    }
  }

  onSubmit() {
    this.userService.registerUser({
      username: this.newUser.username,
      email: this.newUser.email,
      password: this.newUser.password
    }).subscribe(
      () => {
        this.loadUsers();
        this.resetForm();
      },
      (error) => {
        console.error('Failed to add admin:', error);
        alert('Error adding admin');
      }
    );
  }

  resetForm() {
    // Reset form fields to their default values
    this.newUser = {
      username: '',
      email: '',
      password: '',
      roleId: 2 // Default to Customer
    };
  }
}
