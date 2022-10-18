import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RateDataSeries } from 'src/app/models';
import { ExchangeratesService } from 'src/app/services/exchangerates.service';

@Component({
  selector: 'app-resultsview',
  templateUrl: './resultsview.component.html',
  styleUrls: ['./resultsview.component.css'],
})
export class ResultsviewComponent implements OnInit, OnDestroy {
  rates!: RateDataSeries[];
  rateSub$!: Subscription;

  // chart options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  // xAxisLabel: string = 'Products';
  // yAxisLabel: string = 'Sales';
  timeline: boolean = true;
  colorScheme = {
    domain: ['#704FC4', '#4B852C', '#B67A3D'],
  };

  constructor(private rateSvc: ExchangeratesService) {}

  ngOnInit(): void {
    console.log('>>>>> subscribing to rates from rate Service')
    this.rateSub$ = this.rateSvc.onGetRates.subscribe((data) => {
      this.rates = data;
    });
  }

  ngOnDestroy(): void {
    this.rateSub$.unsubscribe();
  }
}
