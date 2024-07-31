import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@core/layout/client-layout/client.routes').then((f) => f.clientRoutes),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('@core/layout/admin-layout/admin.routes').then((f) => f.clientRoutes),
  },
];
