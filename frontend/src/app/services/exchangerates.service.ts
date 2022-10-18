import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject, tap } from 'rxjs';
import { RateDataSeries } from '../models';

@Injectable()
export class ExchangeratesService {
  onGetRates = new Subject<RateDataSeries[]>();

  constructor(private http: HttpClient) {}

  getDailyRate(currFrom: string, currTo: string) {
    // construct query params
    const params = new HttpParams()
      .set('currFrom', currFrom)
      .set('currTo', currTo);

    // put results into event
    firstValueFrom(
      this.http.get<any>('/api/rates', { params }).pipe(
        tap((result) => {
          console.log('>>>>> in tap');
          console.log(result);
          this.onGetRates.next(result);
        })
      )
    );
  }
}
