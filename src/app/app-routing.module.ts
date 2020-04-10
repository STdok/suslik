import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guard/auth.guard';

import { PreloaderService } from './services'

const routes: Routes = [
  { path: '', redirectTo: 'loader', pathMatch: 'full' },
  { path: 'edit-profile', loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule), canActivate: [AuthGuard], data: {preload: true} },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard], data: {preload: true} },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'walkthrough', loadChildren: () => import('./pages/walkthrough/walkthrough.module').then(m => m.WalkthroughPageModule) },
  {
    path: 'create-profile',
    loadChildren: () => import('./pages/create-profile/create-profile.module').then(m => m.CreateProfilePageModule),
    canActivate: [AuthGuard], data: {preload: true}
  },
  { path: 'user-list', loadChildren: () => import('./pages/user-list/user-list.module').then(m => m.UserListPageModule), canActivate: [AuthGuard], data: {preload: true} },
  { path: 'crud', loadChildren: () => import('./pages/crud/crud.module').then(m => m.CrudPageModule), canActivate: [AuthGuard], data: {preload: true} },
  { path: 'geofire', loadChildren: () => import('./pages/geofire/geofire.module').then(m => m.GeofirePageModule), canActivate: [AuthGuard], data: {preload: true} },
  { path: 'event-create', loadChildren: () => import('./pages/event-create/event-create.module').then(m => m.EventCreatePageModule), canActivate: [AuthGuard] },
  { path: 'event-detail/:id', loadChildren: () => import('./pages/event-detail/event-detail.module').then(m => m.EventDetailPageModule), canActivate: [AuthGuard] },
  { path: 'event-list', loadChildren: () => import('./pages/event-list/event-list.module').then(m => m.EventListPageModule), canActivate: [AuthGuard], data: {preload: true} },
  { path: 'song-create', loadChildren: () => import('./pages/song-create/song-create.module').then(m => m.SongCreatePageModule), canActivate: [AuthGuard] },
  { path: 'song-detail/:id', loadChildren: () => import('./pages/song-detail/song-detail.module').then(m => m.SongDetailPageModule), canActivate: [AuthGuard] },
  { path: 'song-list', loadChildren: () => import('./pages/song-list/song-list.module').then(m => m.SongListPageModule), canActivate: [AuthGuard], data: {preload: true} },
  { path: 'show-user', loadChildren: () => import('./pages/modal/show-user/show-user.module').then(m => m.ShowUserPageModule) },
  { path: 'loader', loadChildren: () => import('./pages/loader/loader/loader.module').then(m => m.LoaderPageModule) }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloaderService })],
  exports: [RouterModule]
})

export class AppRoutingModule {}
