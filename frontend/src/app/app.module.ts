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
import { MylistingsviewComponent } from './components/views/mylistingsview.component';
import { ChatService } from './services/chat.service';
import { ChatviewComponent } from './components/views/chatview.component';
import { MychatsComponent } from './components/views/mychats.component';

const routes: Routes = [
  { path: '', component: IndexviewComponent, title: 'CurrencyFlip - Index' },
  {
    path: 'results',
    component: ResultsviewComponent,
    title: 'CurrencyFlip - Search results',
  },
  {
    path: 'favourites',
    component: FavouritesviewComponent,
    title: 'CurrencyFlip - My Favourites',
  },
  {
    path: 'myprofile',
    component: ProfileviewComponent,
    title: 'CurrencyFlip - My Profile',
  },
  {
    path: 'mylistings',
    component: MylistingsviewComponent,
    title: 'CurrencyFlip - My Listings',
  },
  {
    path: 'mychats',
    component: MychatsComponent,
    title: 'CurrencyFlip - My Chats',
  },
  {
    path: 'chat/:chatId',
    component: ChatviewComponent,
    title: 'CurrencyFlip - Chat',
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    IndexviewComponent,
    ResultsviewComponent,
    FavouritesviewComponent,
    ProfileviewComponent,
    MylistingsviewComponent,
    ChatviewComponent,
    MychatsComponent,
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
    ChatService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
