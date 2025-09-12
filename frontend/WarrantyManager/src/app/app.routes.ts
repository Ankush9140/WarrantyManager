import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { Dashboard } from './dashboard/dashboard';
import { Tables } from './tables/tables';
import { AuthGuard } from './authGuard';
import { Active } from './tables/active/active';
import { Expired } from './tables/expired/expired';
import { Claimed } from './tables/claimed/claimed';
import { All } from './tables/all/all';

export const routes: Routes = [
    {path:'',redirectTo:'signin',pathMatch: 'full'},
    {path:'signin',component:SigninComponent},
    {path:'signup',component:SignupComponent},
    {path:'dashboard',component:Dashboard, canActivate: [AuthGuard]},
    {path:'tables',component:Tables, canActivate: [AuthGuard],children:[
        {path:'all',component:All, canActivate: [AuthGuard]},
        {path:'Active',component:Active, canActivate: [AuthGuard]},
        {path:'Expired',component:Expired, canActivate: [AuthGuard]},
        {path:'Claimed',component:Claimed, canActivate: [AuthGuard]},
    ]}
];
