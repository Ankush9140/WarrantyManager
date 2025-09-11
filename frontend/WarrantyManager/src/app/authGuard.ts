import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const isExpired = Date.now() >= decoded.exp * 1000;
        if (!isExpired) return true;
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
    this.router.navigate(['/signin']);
    return false;
  }
}