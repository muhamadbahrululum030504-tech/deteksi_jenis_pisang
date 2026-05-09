import { Routes } from '@angular/router';

export const routes: Routes = [

  // SPLASH
  {
    path: '',
    loadComponent: () =>
      import('./pages/splash/splash.page').then(m => m.SplashPage),
  },

  // HOME
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage),
  },

  // HISTORY
  {
    path: 'history',
    loadComponent: () =>
      import('./pages/history/history.page').then(m => m.HistoryPage),
  },

  // DETAIL
  {
    path: 'detail',
    loadComponent: () =>
      import('./pages/detail/detail.page').then(m => m.DetailPage),
  }

];
