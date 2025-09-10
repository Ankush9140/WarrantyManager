import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    {path:'',redirectTo:'signin',pathMatch: 'full'},

    {path:'signin',component:SigninComponent},
    {path:'signup',component:SignupComponent},
    {path:'dashboard',component:Dashboard}
];
