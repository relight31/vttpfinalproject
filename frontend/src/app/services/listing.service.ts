import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, Subject, tap, throwError } from 'rxjs';
import { Listing } from '../models';

@Injectable()
export class ListingService {
  currencies: string[] = ['SGD', 'MYR'];

  onGetListings = new Subject<Listing[]>();
  onGetListingById = new Subject<Listing>();
  onGetFavourites = new Subject<Listing[]>();

  constructor(private http: HttpClient) {}

  getAllListings(currFrom: string, currTo: string) {
    // construct query params
    const params = new HttpParams()
      .set('currFrom', currFrom)
      .set('currTo', currTo);

    // put results into event
    firstValueFrom(
      this.http.get<Listing[]>('/api/listings', { params: params }).pipe(
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
        .get<Listing>(['/api/listing/', listingId.toString()].join(''), {})
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
    // username + account get from backend
    return firstValueFrom(
      this.http.post<Listing[]>('/api/addFavourite/' + listingId, '', {}).pipe(
        tap((result) => {
          console.log('>>>>> in tap');
          console.log('>>>>> favourites: ' + result);
          // push to event
          this.onGetFavourites.next(result);
        }),
        catchError((error) => {
          console.log('error adding to favourites');
          return throwError(error);
        })
      )
    );
  }

  getFavourites() {
    // username + account get from backend
    firstValueFrom(
      this.http.get<Listing[]>('/api/getFavourites', {}).pipe(
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
    // username + account get from backend
    firstValueFrom(
      this.http.delete<Listing[]>('/api/deleteFavourite/' + listingId, {}).pipe(
        tap((result) => {
          console.log('>>>>> in tap');
          console.log('>>>>> favourites: ' + result);
          // push to event
          this.onGetFavourites.next(result);
        })
      )
    );
  }

  // add listings
  addListing(listing: Listing) {
    return firstValueFrom(
      this.http.post<Listing[]>('/api/addlisting', listing, {}).pipe(
        tap((result) => {
          console.log('>>>>> in tap');
          this.onGetListings.next(result);
        })
      )
    );
  }
  // remove listing by listing id?
  removeListing(listingId: number) {
    return firstValueFrom(
      this.http.delete<Listing[]>('/api/deletelisting/' + listingId, {})
    );
  }

  // get own listings
  // info does not need to be shared with other components, no event
  getOwnListings() {
    return firstValueFrom(this.http.get<Listing[]>('/api/mylistings', {}));
  }
}
