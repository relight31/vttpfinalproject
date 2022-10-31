import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Listing, RateDataSeries } from 'src/app/models';
import { ExchangeratesService } from 'src/app/services/exchangerates.service';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-resultsview',
  templateUrl: './resultsview.component.html',
  styleUrls: ['./resultsview.component.css'],
})
export class ResultsviewComponent implements OnInit, OnDestroy {
  rates: RateDataSeries[] = [];
  rateSub$!: Subscription;

  currFrom!: string;
  currTo!: string;
  currSub$!: Subscription;

  listings: Listing[] = [];
  listingSub$!: Subscription;

  public get width() {
    return window.innerWidth;
  }

  // chart options
  view: [number, number] = [this.width, 400];
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Rate';
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  timeline: boolean = true;
  autoScale: boolean = true;
  colorScheme = {
    domain: ['#704FC4'],
  };
  referenceLines: any[] = [];
  showRefLines: boolean = true;

  constructor(
    private rateSvc: ExchangeratesService,
    private listingSvc: ListingService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('>>>>> subscribing to rates from rate Service');
    this.rateSub$ = this.rateSvc.onGetRates.subscribe((data) => {
      this.rates = data;
    });
    this.currSub$ = this.rateSvc.onGetCurrencies.subscribe((data) => {
      console.log('>>>> currencies: ' + data[0] + data[1]);
      this.currFrom = data[0];
      this.currTo = data[1];
    });
    this.listingSub$ = this.listingSvc.onGetListings.subscribe((data) => {
      this.listings = data;
    });
  }

  ngOnDestroy(): void {
    this.rateSub$.unsubscribe();
    this.currSub$.unsubscribe();
    this.listingSub$.unsubscribe();
  }

  onMouseOver(listing: Listing) {
    console.log('mouseover!');
    this.referenceLines = [
      {
        name: listing.title + ' by ' + listing.username,
        value: listing.rate,
      },
    ];
    console.log(this.referenceLines);
  }

  onMouseOut() {
    console.log('mouseout!');
    this.referenceLines = [];
    console.log(this.referenceLines);
  }

  cardClass() {
    if (this.referenceLines.length) {
      return 'card-mouseover mat-card';
    } else {
      return 'mat-card';
    }
  }

  addFavourite(listingId: number) {
    this.listingSvc
      .addToFavourites(listingId)
      .then(() => {
        this._snackbar.open('Added to Favourites!', 'Close', {
          duration: 1000,
        });
      })
      .catch((error) => {
        this._snackbar.open('Already in favourites', 'Close', {
          duration: 1000,
        });
      });
  }
}
