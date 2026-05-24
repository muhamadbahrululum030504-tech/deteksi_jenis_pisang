import { Routes } from '@angular/router';

export const routes: Routes = [

  // =========================
  // SPLASH
  // =========================
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },

  {
    path: 'splash',
    loadComponent: () =>
      import('./pages/splash/splash.page').then(
        m => m.SplashPage
      ),
  },

  // =========================
  // DASHBOARD
  // =========================
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then(
        m => m.DashboardPage
      ),
  },

  // =========================
  // DETAIL
  // =========================
  {
    path: 'detail',
    loadComponent: () =>
      import('./pages/detail/detail.page').then(
        m => m.DetailPage
      ),
  },

  // =========================
  // HISTORY
  // =========================
  {
    path: 'history',
    loadComponent: () =>
      import('./pages/history/history.page').then(
        m => m.HistoryPage
      ),
  },

];
