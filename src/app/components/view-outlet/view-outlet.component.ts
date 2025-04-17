import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { UtilsModule } from '../../core/utilities/utils.module';

@Component({
  selector: 'app-view-outlet',
  imports: [RouterOutlet, UtilsModule],
  templateUrl: './view-outlet.component.html',
  styleUrl: './view-outlet.component.scss'
})
export class ViewOutletComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/app'
    }
  ];
}
