import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { UtilsModule } from '../../core/utilities/utils.module';
import { IUser } from '../../core/interfaces/user.interface';
import { AuthService } from '../../core/services/auth-service/auth.service';

@Component({
  selector: 'app-view-outlet',
  imports: [RouterOutlet, UtilsModule],
  templateUrl: './view-outlet.component.html',
  styleUrl: './view-outlet.component.scss'
})
export class ViewOutletComponent {
  logginedUser: IUser = {};
  userAlias: string = '';
  items: MenuItem[] = [{
    id: '1',
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => {
      this.authService.logout();
    }
  }] 

  constructor(private authService: AuthService) {
    this.logginedUser = authService.getUserData();
    if(this.logginedUser) {
      this.userAlias = this.logginedUser.firstName?.charAt(0) || "";
    }
  }
  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/app'
    }
  ];
}
