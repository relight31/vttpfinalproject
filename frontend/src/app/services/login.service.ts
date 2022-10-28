import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, firstValueFrom, tap, throwError } from 'rxjs';

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
        }),
        catchError((error) => {
          console.log('error caught in login service');
          console.error(error);
          // TODO error message on failed login
          return throwError(error);
        })
      )
    );
  }
}
