import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExchangeratesService } from 'src/app/services/exchangerates.service';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-indexview',
  templateUrl: './indexview.component.html',
  styleUrls: ['./indexview.component.css'],
})
export class IndexviewComponent implements OnInit {
  form!: FormGroup;
  currencies: string[] = ['SGD', 'MYR'];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private rateSvc: ExchangeratesService,
    private listingSvc: ListingService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  submit() {
    console.log(
      '>>>> currFrom: ' +
        this.form.value.currFrom +
        ' currto: ' +
        this.form.value.currTo
    );
    const currFrom = this.form.value.currFrom;
    const currTo = this.form.value.currTo;
    // navigate to result page
    // form submission handled by results page
    this.router.navigate(['/results'], {
      queryParams: {
        currFrom: currFrom,
        currTo: currTo,
      },
    });
  }

  createForm() {
    this.form = this.fb.group({
      currFrom: this.fb.control('SGD', [Validators.required]),
      currTo: this.fb.control('MYR', [Validators.required]),
    });
  }
}
