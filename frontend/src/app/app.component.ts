import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'frontend';
  form!: FormGroup;
  constructor(private fb: FormBuilder, private loginSvc: LoginService) {}

  ngOnInit(): void {
    this.createLoginForm();
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
    this.loginSvc.login(username, password);
  }

  logout() {
    sessionStorage.removeItem('token');
  }
}
