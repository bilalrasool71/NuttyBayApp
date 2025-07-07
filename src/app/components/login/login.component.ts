import { Component, signal } from '@angular/core';
import { UtilsModule } from '../../core/utilities/utils.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { IUser } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-login',
  imports: [UtilsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm !: FormGroup;
  isUser = signal(false);
  isServer = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.authService.isAuthenticated()) {
      this.isUser.set(true);
      this.router.navigate(['/landing-page']);
    } 
  }

  onLogin() {
    if(this.loginForm.valid) {
      const user: IUser = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
        userId:0
      };
      this.authService.authUser(user)
    } else {
      console.error('Please fill in all fields correctly.');
    
    }
  }

  reset(): void {
    this.loginForm.reset();
  }
}
