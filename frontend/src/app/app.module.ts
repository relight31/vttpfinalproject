import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { IndexviewComponent } from './components/views/indexview.component';
import { ResultsviewComponent } from './components/views/resultsview.component';
import { ListingviewComponent } from './components/views/listingview.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExchangeratesService } from './services/exchangerates.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const routes: Routes = [
  { path: '', component: IndexviewComponent },
  { path: 'results', component: ResultsviewComponent },
  { path: 'listing/:listingId', component: ListingviewComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    IndexviewComponent,
    ResultsviewComponent,
    ListingviewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  providers: [ExchangeratesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
