import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { IndexviewComponent } from './components/views/indexview.component';
import { ResultsviewComponent } from './components/views/resultsview.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExchangeratesService } from './services/exchangerates.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MaterialModule } from './material.module';
import { ListingService } from './services/listing.service';
import { LoginService } from './services/login.service';
import { FavouritesviewComponent } from './components/views/favouritesview.component';
import { ProfileviewComponent } from './components/views/profileview.component';
import { UserInfoService } from './services/userinfo.service';

const routes: Routes = [
  { path: '', component: IndexviewComponent },
  { path: 'results', component: ResultsviewComponent },
  { path: 'favourites', component: FavouritesviewComponent },
  { path: 'myprofile', component: ProfileviewComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    IndexviewComponent,
    ResultsviewComponent,
    FavouritesviewComponent,
    ProfileviewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    MaterialModule,
  ],
  providers: [
    ExchangeratesService,
    ListingService,
    LoginService,
    UserInfoService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
