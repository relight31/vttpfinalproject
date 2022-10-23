import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject, tap } from 'rxjs';
import { Listing } from '../models';

@Injectable()
export class ListingService {
  onGetListings = new Subject<Listing[]>();
  onGetListingById = new Subject<Listing>();

  constructor(private http: HttpClient) {}

  getAllListings(currFrom: string, currTo: string) {
    // construct query params
    const params = new HttpParams()
      .set('currFrom', currFrom)
      .set('currTo', currTo);
    // put results into event
    firstValueFrom(
      this.http.get<Listing[]>('/api/listings', { params }).pipe(
        tap((result) => {
          console.log('>>>>> in tap');
          this.onGetListings.next(result);
        })
      )
    );
  }

  getListingById(listingId: number) {
    firstValueFrom(
      this.http
        .get<Listing>(['/api/listing/', listingId.toString()].join(''))
        .pipe(
          tap((result) => {
            console.log('>>>>> in tap');
            console.log(result);
            this.onGetListingById.next(result);
          })
        )
    );
  }

  addToFavourites(listingId: number) {}

  getFavourites(){}
}
