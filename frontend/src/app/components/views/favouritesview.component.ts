import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Listing } from 'src/app/models';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-favouritesview',
  templateUrl: './favouritesview.component.html',
  styleUrls: ['./favouritesview.component.css'],
})
export class FavouritesviewComponent implements OnInit, OnDestroy {
  favourites: Listing[] = [];
  favouriteSub$!: Subscription;
  mouseover: boolean = false;

  constructor(
    private listingSvc: ListingService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.favouriteSub$ = this.listingSvc.onGetFavourites.subscribe((data) => {
      this.favourites = data;
    });
    this.listingSvc.getFavourites();
  }

  ngOnDestroy(): void {
    this.favouriteSub$.unsubscribe();
  }

  onMouseOver() {
    this.mouseover = true;
  }

  onMouseOut() {
    this.mouseover = false;
  }

  cardClass() {
    if (this.mouseover) {
      return 'card-mouseover mat-card';
    } else {
      return 'mat-card';
    }
  }

  removeFavourite(listingId: number) {
    this.listingSvc.removeFromFavourites(listingId);
    this._snackbar.open('Removed from favourites', 'close', { duration: 1000 });
  }
}
