import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  HelpForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router) {
    this.HelpForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  async onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.HelpForm.valid) {
      const { username, email, password, confirmpassword } = this.HelpForm.value;
      try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', username);
        formData.append('password', password);

        const response = await axios.post('http://127.0.0.1:8000/v1/api/signup', formData);

        this.successMessage = response.data.msg;
        setTimeout(() => this.router.navigate(['/signin']), 1500);
      } catch (error: any) {
        console.error('Signup failed:', error);
        this.errorMessage = error.response?.data?.detail || 'Something went wrong';
      }
    } else {
      this.errorMessage = 'Please fill all fields correctly';
    }
  }
}
