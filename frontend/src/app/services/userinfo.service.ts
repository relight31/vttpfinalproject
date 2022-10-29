import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject, tap } from 'rxjs';
import { UserInfo } from '../models';

@Injectable()
export class UserInfoService {
  onGetOwnInfo = new Subject<UserInfo>();

  constructor(private http: HttpClient) {}

  getOwnInfo() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    );
    firstValueFrom(
      this.http.get<UserInfo>('/api/myprofile', { headers: headers }).pipe(
        tap((result) => {
          console.log('>>>>> in tap');
          this.onGetOwnInfo.next(result);
        })
      )
    );
  }
}