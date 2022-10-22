import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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

  constructor(
    private rateSvc: ExchangeratesService,
    private listingSvc: ListingService
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

  logListing() {
    console.log(this.listings);
  }
}
