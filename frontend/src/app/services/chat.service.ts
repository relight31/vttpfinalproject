import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom, Subject, tap } from 'rxjs';
import { Listing, MessageEntity } from '../models';

@Injectable()
export class ChatService {
  onGetChatIds = new Subject<string[]>();
  onGetRecipients = new Subject<string[]>();
  onGetChatListings = new Subject<Listing[]>();

  constructor(private http: HttpClient) {}
  getChatId(recipient: string, listingId: number) {
    const params = new HttpParams()
      .set('recipient', recipient)
      .set('listingId', listingId);
    return firstValueFrom(
      this.http.get<any>('/api/getchatid', { params: params }).pipe(
        tap((result) => {
          console.log('chat id is: ' + result.chatId);
        })
      )
    );
  }

  startChat(chatId: string) {}

  getChatHistory(chatId: string) {
    const params = new HttpParams().set('chatId', chatId);
    return firstValueFrom(
      this.http.get<MessageEntity[]>('/api/getmessages', {
        params: params,
      })
    );
  }

  getChats() {
    // username from backend
    return firstValueFrom(
      this.http.get<any[]>('/getchats').pipe(
        tap((result) => {
          console.log(result);
          let chatIds: string[] = [];
          let listings: Listing[] = [];
          let recipients: string[] = [];
          result.forEach((element) => {
            chatIds.push(element.chatId);
            listings.push(element.listing);
            recipients.push(element.recipient);
          });
          this.onGetChatIds.next(chatIds);
          this.onGetRecipients.next(recipients);
          this.onGetChatListings.next(listings)
        })
      )
    );
  }
}
