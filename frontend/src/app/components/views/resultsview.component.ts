import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Listing, RateDataSeries } from 'src/app/models';
import { ChatService } from 'src/app/services/chat.service';
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

  username!: string;
  listings: Listing[] = [];
  mouseover: boolean[] = [];
  listingSub$!: Subscription;

  public get width() {
    return window.innerWidth * 0.96;
  }

  public get height() {
    return window.innerHeight * 0.4;
  }

  // chart options
  view: [number, number] = [this.width, this.height];
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
    private chatSvc: ChatService,
    private _snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') || '';
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
      this.listings.forEach((element) => {
        this.mouseover.push(false);
      });
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

  onMouseOver(listing: Listing, i: number) {
    console.log('mouseover!');
    this.referenceLines = [
      {
        name: listing.title + ' by ' + listing.username,
        value: listing.rate,
      },
    ];
    this.mouseover[i] = true;
    console.log(this.referenceLines);
  }

  onMouseOut(i: number) {
    console.log('mouseout!');
    this.referenceLines = [];
    this.mouseover[i] = false;
    console.log(this.referenceLines);
  }

  cardClass(i: number) {
    if (this.mouseover[i]) {
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
    console.log('>>>>> sending listing request to backend');
    // send form values to listing service
    this.listingSvc.addListing(listing);
    this.cancelFormCard();
  }

  cancelFormCard() {
    this.createFormCard();
    this.showFormCard();
  }

  goToChat(listing: Listing) {
    const recipient = listing.username;
    const listingId = listing.listingId;
    this.chatSvc
      .getChatId(recipient, listingId)
      .then((result) => {
        console.log('>>>>> chat ID: ' + result.chatId);
        this.router.navigate(['/chat', result.chatId], {
          queryParams: { recipient: recipient },
        });
      })
      .catch((error) => {
        console.log(error);
        this._snackbar.open('Unable to open chat', 'Close', { duration: 2000 });
      });
  }
}
