import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  HelpForm: FormGroup;

  constructor(private router: Router) {
    this.HelpForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  async onSubmit() {
    if (this.HelpForm.valid) {
      try {
        const formData = new FormData();
        formData.append('email', this.HelpForm.value.username);
        formData.append('password', this.HelpForm.value.password);

        const response = await axios.post('http://127.0.0.1:8000/v1/api/login', formData);

        console.log('Login success:', response.data);
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', this.HelpForm.value.username);
        this.router.navigate(['/dashboard']);
      } catch (error: any) {
        console.error('Login failed:', error);
        alert('Invalid email or password');
      }
    }
  }
}
