import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject, tap } from 'rxjs';
import { UserInfo } from '../models';

@Injectable()
export class UserInfoService {
  onGetOwnInfo = new Subject<UserInfo>();

  constructor(private http: HttpClient) {}

  getOwnInfo() {
    firstValueFrom(
      this.http.get<UserInfo>('/api/myprofile', {}).pipe(
        tap((result) => {
          console.log('>>>>> in tap');
          this.onGetOwnInfo.next(result);
        })
      )
    );
  }

  submitPhoto(formData: FormData) {
    firstValueFrom(
      this.http.post<UserInfo>('/api/myprofile/uploadphoto', formData, {}).pipe(
        tap((result) => {
          console.log('>>>>> in tap');
          console.log(result);
          this.onGetOwnInfo.next(result);
        })
      )
    );
  }
}
