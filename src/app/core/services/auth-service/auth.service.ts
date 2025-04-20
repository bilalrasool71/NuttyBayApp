import { Injectable } from '@angular/core';
import { apiBaseURL } from '../../constant/constant';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUser, ILoginResponse } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${apiBaseURL}Auth/`;

  constructor(private http: HttpClient, private router: Router) { }

  isLoggedIn(): boolean {
    return !!this.isAuthenticated();
  }

  authUser(user: IUser): void {
    this.http.post<ILoginResponse>(this.apiUrl, user).subscribe(
      (data: ILoginResponse) => {
        if (data.isAuthenticated) {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('authorizationdata', data.token);
            localStorage.setItem('userdata', JSON.stringify(data.user));
            this.router.navigate(['/app']);

          }
        }
      },
      (error) => {
        console.error('Authentication failed', error);
      }
    );
  }


  isAuthenticated(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('authorizationdata');
    }
    return null;
  }

  getUserData(): IUser {
    if (typeof localStorage !== 'undefined') {
      const userData = localStorage.getItem('userdata');
      if (userData) {
        const user: IUser = JSON.parse(userData);
        return user;
      } else {
        return {};
      }
    } else {
      return {};
    }
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('storeauthorizationdata');
      localStorage.removeItem('authorizationdata');
      localStorage.removeItem('StoreData');
      localStorage.removeItem('userdata');
      this.router.navigate(['/login']);
    }
  }
}
