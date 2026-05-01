import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./pages/splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./pages/history/history.page').then(m => m.HistoryPage)
  },
  {
    path: 'detail',
    loadComponent: () =>
      import('./pages/detail/detail.page').then(m => m.DetailPage)
  }
];