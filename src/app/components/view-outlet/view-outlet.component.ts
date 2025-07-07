import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { UtilsModule } from '../../core/utilities/utils.module';
import { IUser } from '../../core/interfaces/user.interface';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { RestService } from '../../services/rest-service/rest.service';

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
  }
  ]

  constructor(private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private restService: RestService) {
    this.logginedUser = authService.getUserData();
    if (this.logginedUser) {
      this.userAlias = this.logginedUser.firstName?.charAt(0) || "";
    }
    if (this.logginedUser.purpose === "TESTING") {
      this.items.push(

        {
          label: 'Delete All Testing Data',
          command: () => {
            this.DeleteTestingData();
          },
          icon: 'pi pi-trash',
        }
      )
    }
  }

  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/app'
    }
  ];


  DeleteTestingData() {
    this.confirmationService.confirm({
      message: `Do you really want to delete all testing data?<br/> You won’t be able to undo once deleted?`,
      header: 'Delete Production Run',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.restService.deleteTestingData(Number(this.logginedUser.userId)).subscribe({
          next: () => {
            setTimeout(() => {
              window.location.reload();
            }, 15)
          },
          error: (err) => {
          }
        });
      },
      reject: () => {
        // Reject logic if needed
      },
      acceptLabel: 'Delete',
      acceptIcon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Cancel',
      rejectIcon: 'pi pi-times',
      rejectButtonStyleClass: 'p-button-contrast',
      defaultFocus: 'reject'
    });
  }
 GoToHome() {
    this.router.navigateByUrl('/landing-page')
  }
}
