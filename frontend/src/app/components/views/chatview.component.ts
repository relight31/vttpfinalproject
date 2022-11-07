import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageEntity } from 'src/app/models';
import { ChatService } from 'src/app/services/chat.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client/';

@Component({
  selector: 'app-chatview',
  templateUrl: './chatview.component.html',
  styleUrls: ['./chatview.component.css'],
})
export class ChatviewComponent implements OnInit, OnDestroy {
  recipient!: string;
  channelName!: string;
  socket?: WebSocket;
  stompClient?: Stomp.Client;
  messageForm!: FormGroup;
  messages: MessageEntity[] = [];
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private chatSvc: ChatService
  ) {}

  ngOnInit(): void {
    this.channelName = this.route.snapshot.params['chatId'];
    this.route.queryParams.subscribe((params) => {
      this.recipient = params['recipient'];
    });
    this.createForm();
    this.connectToChat();
  }

  connectToChat() {
    console.log('loading chathistory');
    this.loadChatHistory(this.channelName);
    console.log('>>>> creating websocket');
    this.socket = new SockJS('/api/chat');
    console.log('>>>> specifying websocket in stomp client');
    this.stompClient = Stomp.over(this.socket);
    console.log('>>>> connecting to websocket');
    this.stompClient.connect({}, (frame) => {
      this.stompClient?.subscribe(
        '/api/topic/messages/' + this.channelName,
        (response) => {
          this.messages.push(JSON.parse(response.body));
        },
        { id: this.channelName + sessionStorage.getItem('username') }
      );
    });
  }

  ngOnDestroy(): void {
    this.stompClient?.disconnect(() => {
      this.stompClient?.unsubscribe(
        this.channelName + sessionStorage.getItem('username')
      );
      console.log('Disconnected from chat');
    });
  }

  createForm() {
    this.messageForm = this.fb.group({
      message: this.fb.control('', [Validators.required]),
    });
  }

  loadChatHistory(chatId: string) {
    this.chatSvc.getChatHistory(chatId).then((result) => {
      this.messages = result;
    });
  }

  sendMessage() {
    if (this.messageForm.value.message != '') {
      this.stompClient?.send(
        '/api/app/chat/' + this.channelName,
        {},
        JSON.stringify({
          chatId: this.channelName,
          sender: sessionStorage.getItem('username'),
          content: this.messageForm.value.message,
          timestamp: 'backend defined',
        })
      );
    }
    this.createForm();
  }

  messageClass(sender: string) {
    if (sender === this.recipient) {
      return 'message-left';
    } else {
      return 'message-right';
    }
  }

  scrollToBottom() {
    this.messageContainer.nativeElement.scrollTop =
      this.messageContainer.nativeElement.scrollHeight;
  }
}
