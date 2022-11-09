import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Listing } from 'src/app/models';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mychats',
  templateUrl: './mychats.component.html',
  styleUrls: ['./mychats.component.css'],
})
export class MychatsComponent implements OnInit, OnDestroy {
  listings: Listing[] = [];
  chatIds: string[] = [];
  recipients: string[] = [];
  mouseover: boolean[] = [];
  username!: string;

  listingSub$!: Subscription;
  chatIdSub$!: Subscription;
  recipientSub$!: Subscription;

  constructor(
    private chatSvc: ChatService,
    private router: Router,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') || '';
    this.chatIdSub$ = this.chatSvc.onGetChatIds.subscribe((data) => {
      this.chatIds = data;
    });
    this.recipientSub$ = this.chatSvc.onGetRecipients.subscribe((data) => {
      this.recipients = data;
    });
    this.listingSub$ = this.chatSvc.onGetChatListings.subscribe((data) => {
      this.listings = data;
    });
    this.chatSvc
      .getChats()
      .then((result) => {
        this.listings.forEach((element) => {
          this.mouseover.push(false);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    this.listingSub$.unsubscribe();
    this.chatIdSub$.unsubscribe();
    this.recipientSub$.unsubscribe();
  }

  onMouseOver(i: number) {
    this.mouseover[i] = true;
  }

  onMouseOut(i: number) {
    this.mouseover[i] = false;
  }

  cardClass(i: number) {
    if (this.mouseover[i]) {
      return 'card-mouseover mat-card';
    } else {
      return 'mat-card';
    }
  }

  goToChat(i: number) {
    const recipient = this.recipients[i];
    this.router.navigate(['/chat', this.chatIds[i]], {
      queryParams: { recipient: recipient },
    });
  }
}
