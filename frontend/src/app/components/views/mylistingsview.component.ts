import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Listing } from 'src/app/models';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-mylistingsview',
  templateUrl: './mylistingsview.component.html',
  styleUrls: ['./mylistingsview.component.css'],
})
export class MylistingsviewComponent implements OnInit {
  listings: Listing[] = [];
  mouseover: boolean = false;

  constructor(
    private listingSvc: ListingService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.listingSvc
      .getOwnListings()
      .then((results) => {
        this.listings = results;
      })
      .catch((error) => {
        console.log(error);
        // error message in html template
      });
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

  removeListing(listingId: number) {
    this.listingSvc
      .removeListing(listingId)
      .then((results) => {
        this.listings = results;
        this._snackbar.open('Deleted listing no. ' + listingId, 'Close', {
          duration: 2000,
        });
      })
      .catch((error) => {
        this._snackbar.open(
          'Unable to delete listing, try again later',
          'Close',
          {
            duration: 2000,
          }
        );
      });
  }
}
