import { Component } from '@angular/core';
import { Order, OrderService } from '../../services/order.service';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderStatus, OrderStatusService } from '../../services/order-status.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders: Order[] = [];
  orderStatuses: OrderStatus[] = [];
  

  constructor(private orderService: OrderService, private orderStatusService: OrderStatusService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadOrders();
    this.loadOrderStatuses();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
  }

  deleteOrder(orderId: number) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          this.orders = this.orders.filter((order) => order.id !== orderId); 
        },
        error: (err) => {
          console.error('Error deleting order:', err);
          alert('Failed to delete order.');
        },
      });
    }
  }

  loadOrderStatuses(){
    this.orderStatusService.getOrderStatus().subscribe(
      (data) => {
        this.orderStatuses = data;
        this.cdr.detectChanges(); 
      }
    )
  }

  modifyStatus(event: Event, orderId: number) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const statusId = parseInt(selectedValue, 10); 

    if (statusId) {
      this.orderService.modifyStatus(orderId, statusId).subscribe({
        next: (response) => {
          console.log('Order status updated successfully:', response);
          alert('Order status updated successfully');
          this.loadOrders(); 
        },
        error: (err) => {
          console.error('Error updating order status:', err);
          alert(`Failed to update order status. ${err.message || err}`);
        },
      });
    } else {
      console.warn('Invalid status selected');
    }
  }
}
