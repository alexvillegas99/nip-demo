import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  @ViewChild('password') password: ElementRef | undefined;
  loginForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.iniciarForm();
  }

  iniciarForm() {
    this.loginForm = this.fb.group({
      correo: ['jparra@hoptech.dev', Validators.required],
      clave: ['cf7293', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this._authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('res', res);
          if (res.accessToken) {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
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
