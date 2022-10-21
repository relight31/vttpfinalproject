import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject, tap } from 'rxjs';
import { RateDataSeries } from '../models';

@Injectable()
export class ExchangeratesService {
  onGetRates = new Subject<RateDataSeries[]>();
  onGetCurrencies = new Subject<string[]>();

  constructor(private http: HttpClient) {}

  getDailyRate(currFrom: string, currTo: string) {
    // construct query params
    const params = new HttpParams()
      .set('currFrom', currFrom)
      .set('currTo', currTo);

    // put currencies into event
    const temp = [currFrom, currTo];
    console.log(temp);
    // this.onGetCurrencies.next(temp);

    // put results into event
    firstValueFrom(
      this.http.get<any>('/api/rates', { params }).pipe(
        tap((result) => {
          console.log('>>>>> in tap');
          console.log(result);
          this.onGetRates.next(result);
          this.onGetCurrencies.next(temp);
        })
      )
    );
  }
}
