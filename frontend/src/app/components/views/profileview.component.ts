import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/models';
import { UserInfoService } from 'src/app/services/userinfo.service';

@Component({
  selector: 'app-profileview',
  templateUrl: './profileview.component.html',
  styleUrls: ['./profileview.component.css'],
})
export class ProfileviewComponent implements OnInit {
  myInfo!: UserInfo;
  infoSub$!: Subscription;

  constructor(private userinfoSvc: UserInfoService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.infoSub$ = this.userinfoSvc.onGetOwnInfo.subscribe((data) => {
      this.myInfo = data;
    });
    this.userinfoSvc.getOwnInfo();
  }
}
