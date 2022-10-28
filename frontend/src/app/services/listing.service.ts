import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject, tap } from 'rxjs';
import { Listing } from '../models';

@Injectable()
export class ListingService {
  onGetListings = new Subject<Listing[]>();
  onGetListingById = new Subject<Listing>();
  onGetFavourites = new Subject<Listing[]>();

  constructor(private http: HttpClient) {}

  getAllListings(currFrom: string, currTo: string) {
    // construct query params
    const params = new HttpParams()
      .set('currFrom', currFrom)
      .set('currTo', currTo);
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    );
    // put results into event
    firstValueFrom(
      this.http
        .get<Listing[]>('/api/listings', { params: params, headers: headers })
        .pipe(
          tap((result) => {
            console.log('>>>>> in tap');
            this.onGetListings.next(result);
          })
        )
    );
  }

  getListingById(listingId: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    );
    firstValueFrom(
      this.http
        .get<Listing>(['/api/listing/', listingId.toString()].join(''), {
          headers,
        })
        .pipe(
          tap((result) => {
            console.log('>>>>> in tap');
            console.log(result);
            this.onGetListingById.next(result);
          })
        )
    );
  }

  addToFavourites(listingId: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    );
    // username + account get from backend
    firstValueFrom(
      this.http
        .post<Listing[]>('/api/addFavourite/' + listingId, '', {
          headers: headers,
        })
        .pipe(
          tap((result) => {
            console.log('>>>>> in tap');
            console.log('>>>>> favourites: ' + result);
            // push to event
            this.onGetFavourites.next(result);
          })
        )
    );
  }

  getFavourites() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    );
    // username + account get from backend
    firstValueFrom(
      this.http.get<Listing[]>('/api/getFavourites', { headers: headers }).pipe(
        tap((result) => {
          console.log('>>>>> in tap');
          console.log('>>>>> favourites: ' + result);
          // push to event
          this.onGetFavourites.next(result);
        })
      )
    );
  }

  removeFromFavourites(listingId: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    );
    // username + account get from backend
    firstValueFrom(
      this.http
        .delete<Listing[]>('/api/deleteFavourite/' + listingId, {
          headers: headers,
        })
        .pipe(
          tap((result) => {
            console.log('>>>>> in tap');
            console.log('>>>>> favourites: ' + result);
            // push to event
            this.onGetFavourites.next(result);
          })
        )
    );
  }
}
