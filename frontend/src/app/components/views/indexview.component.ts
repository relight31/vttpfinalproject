import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-indexview',
  templateUrl: './indexview.component.html',
  styleUrls: ['./indexview.component.css'],
})
export class IndexviewComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.createForm();
  }

  submit() {
    // submit form to backend
    // get MAS exchange rates
    // get listings for this exchange
    // navigate to result page
    this.router.navigate(["/results"])
  }

  createForm() {
    this.form = this.fb.group({
      currFrom: this.fb.control('', [Validators.required]),
      currTo: this.fb.control('', [Validators.required]),
    });
  }
}
