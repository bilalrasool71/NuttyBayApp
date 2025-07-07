import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { AuthService } from '../../../core/services/auth-service/auth.service';
import { IUser } from '../../../core/interfaces/user.interface';
import { RestService } from '../../../services/rest-service/rest.service';

@Component({
  selector: 'app-web-outlet',
  imports: [RouterOutlet, MenubarModule, UtilsModule, RouterLink, RouterLinkActive],
  templateUrl: './web-outlet.component.html',
  styleUrl: './web-outlet.component.scss'
})
export class WebOutletComponent {
  logginedUser: IUser = <IUser>{};
  userAlias: string = '';
  items: MenuItem[] = [
    {
      label: 'Sales',
      items: [
        { label: 'New Sales Order', routerLink: '/web/new-sales-order', id: 'new-sales-order' },
        { label: 'Pending to Dispatch Orders', routerLink: '/web/pending-dispatch' },
        { label: 'Sales Order Report', routerLink: '/web/sales-order-report' }
      ]
    },
    {
      label: 'Reports',
      items: [
        { label: 'Reconciliation Report', routerLink: '/web/reconciliation-report' },
        { label: 'Product Inventory Report', routerLink: '/web/product-inventory-report' },
        { label: 'Production Summary Report', routerLink: '/web/production-summary-report' },
        { label: 'Monthly Sales Report', routerLink: '/web/monthly-sales-report'},
        { label: 'Product Wise Monthly Sales Report', routerLink: '/web/product-wise-sales-report-monthly'}
      ]
    },
    {
      label: 'Product Pricing',
      items: [
        { label: 'View / Update', routerLink: '/web/add-new-tier' },
        { label: 'Add New Tier', routerLink: '/web/upsert-tiers' },
      ]
    },
    { label: 'Go To Production Run', routerLink: '/app' }
  ];

  userMenuItems: MenuItem[] = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  constructor(
    private authService: AuthService, 
    private confirmationService: ConfirmationService, 
    private restService: RestService, 
    private router: Router
  ) {
    this.logginedUser = authService.getUserData();
    if (this.logginedUser) {
      this.userAlias = this.logginedUser.firstName?.charAt(0) || "";
    }

    // Add delete option only for testing users
    if (this.logginedUser.purpose === "TESTING") {
      this.userMenuItems.unshift({
        label: 'Delete All Testing Data',
        icon: 'pi pi-trash',
        command: () => this.DeleteTestingData()
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  DeleteTestingData() {
    this.confirmationService.confirm({
      message: `Do you really want to delete all testing data?<br/> You won't be able to undo once deleted?`,
      header: 'Delete All Testing Data',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.restService.deleteTestingData(Number(this.logginedUser.userId)).subscribe({
          next: () => {
            window.location.reload();
          },
          error: (err) => {
            // Error handling if needed
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
    this.router.navigateByUrl('/landing-page');
  }
}