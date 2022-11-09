import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Listing } from 'src/app/models';
import { ChatService } from 'src/app/services/chat.service';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-favouritesview',
  templateUrl: './favouritesview.component.html',
  styleUrls: ['./favouritesview.component.css'],
})
export class FavouritesviewComponent implements OnInit, OnDestroy {
  username!: string;
  favourites: Listing[] = [];
  favouriteSub$!: Subscription;
  mouseover: boolean = false;

  constructor(
    private listingSvc: ListingService,
    private chatSvc: ChatService,
    private router: Router,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') || '';
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

  // goToChat(listing: Listing) {
  //   const recipient = listing.username;
  //   const listingId = listing.listingId;
  //   this.chatSvc
  //     .getChatId(recipient, listingId)
  //     .then((result) => {
  //       console.log('>>>>> chat ID: ' + result.chatId);
  //       this.router.navigate(['/chat', result.chatId], {
  //         queryParams: { recipient: recipient },
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       this._snackbar.open('Unable to open chat', 'Close', { duration: 2000 });
  //     });
  // }
}
