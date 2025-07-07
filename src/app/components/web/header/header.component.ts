import { Component, Input } from '@angular/core';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [UtilsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() Title: string = '';
  @Input() GoBackLink: string = '';
}
