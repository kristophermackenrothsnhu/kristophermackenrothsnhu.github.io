import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {

  public formError: string = '';

  credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void { }

  public onLoginSubmit(): void {
    this.formError = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Email and password are required.';
      return;
    }

    const newUser: User = {
      name: this.credentials.name,
      email: this.credentials.email
    };

    this.authenticationService.login(newUser, this.credentials.password)
      .subscribe({
        next: (res) => {
          // Save token
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('user_email', this.credentials.email);

          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.formError = 'Login failed, please check your credentials.';
        }
      });
  }
}
