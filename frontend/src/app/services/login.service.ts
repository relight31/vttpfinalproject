import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    let details = {
      username: username,
      password: password,
    };
    console.log('>>>> login details: ' + details);
    firstValueFrom(
      this.http.post('/token', details, { responseType: 'text' }).pipe(
        tap((result) => {
          if (result) {
            sessionStorage.setItem('token', result);
          }
        })
      )
    );
  }
}
