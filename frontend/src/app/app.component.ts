import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'frontend';
  form!: FormGroup;
  hide: boolean = true;
  currentUser: string = '';

  constructor(
    private fb: FormBuilder,
    private loginSvc: LoginService,
    private _snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
    this.currentUser = sessionStorage.getItem('username') || '';
  }

  createLoginForm() {
    this.form = this.fb.group({
      username: this.fb.control<string>('', [Validators.required]),
      password: this.fb.control<string>('', [Validators.required]),
    });
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('token') != null;
  }

  submitLogin() {
    const username = this.form.value.username;
    const password = this.form.value.password;
    // Submit username and password to loginservice
    this.loginSvc
      .login(username, password)
      .then(() => {
        this._snackbar.open('Logged in successfully', 'Close', {
          duration: 1000,
        });
        this.currentUser = sessionStorage.getItem('username') || '';
      })
      .catch((error) => {
        this._snackbar.open('Invalid login credentials', 'Close', {
          duration: 2000,
        });
      });
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.currentUser = '';
    this._snackbar.open('Logged out successfully!', 'Close', {
      duration: 2000,
    });
    this.createLoginForm();
    this.router.navigate(['/']);
  }

  signUp() {
    const username = this.form.value.username;
    const password = this.form.value.password;
    // submit username and password to loginservice
    this.loginSvc
      .signUp(username, password)
      .then(() => {
        this.router.navigate(['/myprofile']);
        this._snackbar.open(
          'Welcome to CurrencyFlip, ' + username + '!',
          'Close',
          { duration: 2000 }
        );
        this.currentUser = username;
      })
      .catch((error) => {
        console.log(error);
        this._snackbar.open(
          'Unable to create new account, try again later',
          'Close',
          {
            duration: 2000,
          }
        );
      });
  }
}
