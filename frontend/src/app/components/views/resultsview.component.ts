import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
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
  currencies: string[] = [];

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

  formCardVisible: boolean = false;
  formCard!: FormGroup;

  constructor(
    private rateSvc: ExchangeratesService,
    private listingSvc: ListingService,
    private _snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private fb: FormBuilder
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
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.rateSvc.getDailyRate(params['currFrom'], params['currTo']);
      this.listingSvc.getAllListings(params['currFrom'], params['currTo']);
    });
    this.currencies = this.listingSvc.currencies;
    this.createFormCard();
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

  createFormCard() {
    this.formCard = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      currFrom: this.fb.control('', [Validators.required]),
      currTo: this.fb.control('', [Validators.required]),
      rate: this.fb.control(0, [Validators.min(0.0000000001)]),
      description: this.fb.control('', [Validators.required]),
    });
  }

  showFormCard() {
    this.formCardVisible = !this.formCardVisible;
  }

  submitFormCard() {
    const listing = this.formCard.value as Listing;
    console.log(listing);
    console.log(">>>>> sending listing request to backend")
    // send form values to listing service
    this.listingSvc.addListing(listing);
    this.cancelFormCard();
  }

  cancelFormCard() {
    this.createFormCard();
    this.showFormCard();
  }
}
