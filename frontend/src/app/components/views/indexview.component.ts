import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExchangeratesService } from 'src/app/services/exchangerates.service';

@Component({
  selector: 'app-indexview',
  templateUrl: './indexview.component.html',
  styleUrls: ['./indexview.component.css'],
})
export class IndexviewComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private rateSvc: ExchangeratesService
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
    // submit form to backend
    this.rateSvc.getDailyRate(this.form.value.currFrom, this.form.value.currTo);
    // get exchange rates
    // get listings for this exchange
    // navigate to result page
    this.router.navigate(['/results']);
  }

  createForm() {
    this.form = this.fb.group({
      currFrom: this.fb.control('SGD', [Validators.required]),
      currTo: this.fb.control('MYR', [Validators.required]),
    });
  }
}
