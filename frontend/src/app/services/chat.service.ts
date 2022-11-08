import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { MessageEntity } from '../models';

@Injectable()
export class ChatService {
  constructor(private http: HttpClient) {}
  getChatId(recipient: string, listingId: number) {
    // const headers = new HttpHeaders().set(
    //   'Authorization',
    //   'Bearer ' + sessionStorage.getItem('token')
    // );
    const params = new HttpParams()
      .set('recipient', recipient)
      .set('listingId', listingId);
    return firstValueFrom(
      this.http
        .get<any>('/api/getchatid', { params: params })
        .pipe(
          tap((result) => {
            console.log('chat id is: ' + result.chatId);
          })
        )
    );
  }

  startChat(chatId: string) {}

  getChatHistory(chatId: string) {
    // const headers = new HttpHeaders().set(
    //   'Authorization',
    //   'Bearer ' + sessionStorage.getItem('token')
    // );
    const params = new HttpParams().set('chatId', chatId);
    return firstValueFrom(
      this.http.get<MessageEntity[]>('/api/getmessages', {
        params: params,
      })
    );
  }
}
