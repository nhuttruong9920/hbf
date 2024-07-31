import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './client-layout.component';

export const clientRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@core/auth/client-login/client-login.component').then(
        (mod) => mod.ClientLoginComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('@feature/home/home.component').then((mod) => mod.HomeComponent),
  },
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {
        path: 'delivery',
        loadComponent: () =>
          import('@feature/client/delivery/delivery.component').then(
            (mod) => mod.DeliveryComponent
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('@feature/client/cart/cart.component').then(
            (mod) => mod.CartComponent
          ),
      },
      {
        path: 'payment',
        loadComponent: () =>
          import('@feature/client/payment/payment.component').then(
            (mod) => mod.PaymentComponent
          ),
      },
    ],
  },
];
