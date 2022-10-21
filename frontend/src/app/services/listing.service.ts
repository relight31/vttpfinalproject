import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ListingService {
  constructor(private http: HttpClient) {}
}
