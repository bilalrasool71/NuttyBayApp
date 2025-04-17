import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UtilsModule } from './core/utilities/utils.module';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { LoadingService } from './core/services/loading-service/loading.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UtilsModule, LottieComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private loadingService: LoadingService) {
    this.listenToLoading();
    
  }
  loading: boolean = false;
  options: AnimationOptions = {
    path: '/anims/loading.json'
  }
  title = 'Nutty Bays';

  ngOnInit(): void {
    this.listenToLoading();
  }

  listenToLoading(): void {
    this.loadingService.$loadingSub
    .pipe(delay(0))
    .subscribe((loading: boolean) => {
      this.loading = loading;
    });
  }
}
