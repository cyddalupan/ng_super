import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AuthGuard] // Secure dashboard (superuser with agency_id NULL from JWT)
  },
  {
    path: 'agency',
    loadChildren: () => import('./agency/agency.module').then(m => m.AgencyPageModule),
    canActivate: [AuthGuard] // Secure agency (superuser only)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserPageModule),
    canActivate: [AuthGuard] // Secure user (superuser only)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true }) // Keep useHash: true for /#/
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}