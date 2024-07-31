import { Routes } from '@angular/router';
import { authGuard } from '@core/guard/auth.guard';
import { AdminLayoutComponent } from './admin-layout.component';

export const clientRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@core/auth/admin-login/admin-login.component').then(
        (mod) => mod.AdminLoginComponent
      ),
  },

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'category',
        loadComponent: () =>
          import('@feature/admin/menu/category/category.component').then(
            (mod) => mod.CategoryComponent
          ),
      },
      {
        path: 'dish',
        loadComponent: () =>
          import('@feature/admin/menu/dish/dish.component').then(
            (mod) => mod.DishComponent
          ),
      },
      {
        path: 'order',
        loadComponent: () =>
          import('@feature/admin/order/order.component').then(
            (mod) => mod.OrderComponent
          ),
      },
      {
        path: 'account',
        children: [
          {
            path: 'user',
            loadComponent: () =>
              import('@feature/admin/account/user/user.component').then(
                (mod) => mod.UserComponent
              ),
          },
          {
            path: 'permission',
            loadComponent: () =>
              import(
                '@feature/admin/account/permission/permission.component'
              ).then((mod) => mod.PermissionComponent),
          },
          {
            path: 'role',
            loadComponent: () =>
              import('@feature/admin/account/role/role.component').then(
                (mod) => mod.RoleComponent
              ),
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'order',
      },
    ],
  },
];
