import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @ViewChild('password') password: ElementRef | undefined;
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {}

  loginForm = this.fb.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
  });
  login() {
    if (this.loginForm.valid) {
      this.router.navigate(['/']);
    }
  }
  viewPasswordFormlogin = false;
  ViewPassword() {
    this.viewPasswordFormlogin = !this.viewPasswordFormlogin;
    this.password!.nativeElement.type === 'password'
      ? (this.password!.nativeElement.type = 'text')
      : (this.password!.nativeElement.type = 'password');
  }
}
