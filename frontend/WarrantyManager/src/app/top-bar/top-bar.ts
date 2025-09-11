import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss'
})
export class Topbar {
  constructor(private router: Router) {}
    username: string = localStorage.getItem('username') || '';
    logout: boolean = false;
    toggleLogout(){
      this.logout = !this.logout;
    }
    logoutt() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/signin']);
  }
}
