import { Component } from '@angular/core';
import { PasswordManagerService } from '../password-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isError: boolean = false;
  isSignUp: boolean = false;
  actionLabel = 'Login';
  isLoading: boolean = false;
  constructor(
    private passwordManagerService: PasswordManagerService,
    private router: Router
  ) {
    if (localStorage.getItem('isLogin') == 'true') {
      this.router.navigate(['/site-list']);
    }
  }
  onSubmit(values: any) {
    if (this.isSignUp) {
      this.isLoading = true;
      this.passwordManagerService
        .signup(values.email, values.password)
        .then(() => {
          this.isError = false;
          localStorage.setItem('isLogin', 'true');
          this.router.navigate(['/site-list']);
          this.isLoading = false;
        })
        .catch((err) => {
          this.isError = true;
          this.isLoading = false;
        });
    }
    if (!this.isSignUp) {
      this.isLoading = true;
      this.passwordManagerService
        .login(values.email, values.password)
        .then(() => {
          this.router.navigate(['/site-list']);
          this.isError = false;
          localStorage.setItem('isLogin', 'true');
          this.isLoading = false;
        })
        .catch((err) => {
          this.isError = true;
          this.isLoading = false;
        });
    }
  }
  handleSignup(status: string) {
    if (status == 'login') {
      this.isSignUp = false;
      this.actionLabel = 'Login';
      this.isError = false;
    }
    if (status == 'signup') {
      this.isSignUp = true;
      this.actionLabel = 'Sign up';
      this.isError = false;
    }
  }
}
