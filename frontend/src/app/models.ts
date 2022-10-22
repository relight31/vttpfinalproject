export interface RateDataSeries {
  name: string;
  series: [];
}

export interface Listing {
  listingId: number;
  title: string;
  userId: number;
  currFrom: string;
  currTo: string;
  rate: number;
  description: string;
  username: string;
}
