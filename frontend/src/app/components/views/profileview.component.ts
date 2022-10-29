import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  fileName: string = '';
  formData: FormData = new FormData();

  constructor(
    private userinfoSvc: UserInfoService,
    private fb: FormBuilder,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.infoSub$ = this.userinfoSvc.onGetOwnInfo.subscribe((data) => {
      this.myInfo = data;
    });
    this.userinfoSvc.getOwnInfo();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const data = new FormData();
      data.append('profilepic', file);
      this.formData = data;
    }
  }

  onSubmitPhoto() {
    // submit file to backend via service
    this.userinfoSvc.submitPhoto(this.formData);
    this._snackbar.open('Submitting profile photo', 'Close', {
      duration: 1000,
    });
    // reset file variables
    this.fileName = '';
    this.formData = new FormData();
    // refresh user info
    this.userinfoSvc.getOwnInfo();
  }

  hideButton() {
    if (this.fileName) {
      return 'mat-button';
    } else {
      return 'no-display';
    }
  }
}
