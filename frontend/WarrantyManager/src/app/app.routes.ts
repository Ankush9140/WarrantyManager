import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { Dashboard } from './dashboard/dashboard';
import { Tables } from './tables/tables';
import { AuthGuard } from './authGuard';

export const routes: Routes = [
    {path:'',redirectTo:'signin',pathMatch: 'full'},
    {path:'signin',component:SigninComponent},
    {path:'signup',component:SignupComponent},
    {path:'dashboard',component:Dashboard, canActivate: [AuthGuard]},
    {path:'tables',component:Tables, canActivate: [AuthGuard]}
];
