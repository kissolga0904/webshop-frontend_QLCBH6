import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { ShippingMethod, ShippingMethodService } from '../../services/shipping-method.service';
import { OrderService, PlaceOrderRequest } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  subtotal = 0;
  shipping = 8; 
  total = 0;
  checkoutForm: FormGroup;
  countries: string[] = [
    'Hungary',
    'Germany',
    'Austria',
    'France',
    'Italy',
    'Spain',
    'United Kingdom',
    'United States',
    'Poland',
    'Netherlands',
    'Czech Republic',
    'Romania',
    'Slovakia',
    'Slovenia',
    'Switzerland'
  ];
  shippingMethods: ShippingMethod[] = [];
  selectedShippingMethodId!: number;

  constructor(private cartService: CartService, 
    private fb: FormBuilder, 
    private cdr: ChangeDetectorRef, 
    private errorHandlerService: ErrorHandlerService,
    private shippingMethodService: ShippingMethodService,
    private orderService: OrderService,
    private router: Router) {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cardHolder: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      address: this.fb.group({
        street: ['', Validators.required],
        houseNumber:['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
        country: ['', Validators.required],
      }),
      shipping: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching cart items', err)
    });
    this.shippingMethodService.getAllShippingMethods().subscribe({
      next: (methods: ShippingMethod[]) => {
        this.shippingMethods = methods;
        if (methods.length > 0) {
          this.selectedShippingMethodId = methods[0].id;
          this.shipping = methods[0].price;
          this.calculateTotal();
        }
      },
      error: (err:any) => console.error('Error fetching shipping methods', err)
    });
  }

  calculateTotal() {
    const selectedMethod = this.shippingMethods.find(m => m.id === this.selectedShippingMethodId);
    this.shipping = selectedMethod ? selectedMethod.price : 0;
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    this.total = parseFloat((this.subtotal + this.shipping).toFixed(2));
  }

  formatCardNumber() {
    const input = this.checkoutForm.get('cardNumber');
    let value = input?.value.replace(/\D/g, ''); // remove non-digits
    if (value.length > 16) value = value.slice(0, 16);
  
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1-');
    input?.setValue(formatted, { emitEvent: false });
  }

  formatExpiry() {
    const control = this.checkoutForm.get('expiry');
    let value = control?.value.replace(/\D/g, ''); // remove non-digits
  
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
  
    control?.setValue(value, { emitEvent: false });
  }
  
  onShippingMethodChange(selectedId: number) {
    this.selectedShippingMethodId = selectedId;
    this.calculateTotal();  // Recalculate the total when the shipping method changes
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      const formData = this.checkoutForm.value;
      const address = formData.address;

      const orderPayload: PlaceOrderRequest = {
        street: address.street,
        houseNumber: Number(address.houseNumber),
        city: address.city,
        postalCode: Number(address.postalCode),
        country: address.country,
        paymentMethodId: 1, // fixed card payment for now
        shippingMethodId: Number(formData.shipping)
      };

      this.orderService.placeOrder(orderPayload).subscribe({
        next: () => {
          this.orderService.clearCart().subscribe(() =>{
            console.log('Cart cleared');
            this.router.navigate(['/order-success']);
          }
          )
          console.log('Order placed successfully');
          // optionally reset form or navigate
        },
        error: (err) => {
          console.error('Failed to place order:', err);
        }
      });
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
