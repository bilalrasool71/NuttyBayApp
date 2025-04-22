import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { baseURL } from '../../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  $loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingMap: Map<string, boolean> = new Map<string, boolean>();
  constructor() { }

  baseUrl: string = baseURL;
  private CallExclusionList: string[] = [
    'UpdateTaskStatuses',
  ];

  setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error('The request URL must be provided to the LoadingService.setLoading function');
    }
    if (loading === true) {

      if (!this.isStringInUrl(url)) {
        this.loadingMap.set(url, loading);
        this.$loadingSub.next(true);
      }
      // this.toastr.info(url)
    }
    else if (loading === false && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }
    if (this.loadingMap.size === 0) {
      this.$loadingSub.next(false);
    }
  }

  isStringInUrl(url: any) {
    for (var i = 0; i < this.CallExclusionList.length; i++) {
      if (url.indexOf(this.CallExclusionList[i]) !== -1) {
        return true;
      }
    }
    return false;
  }
}
