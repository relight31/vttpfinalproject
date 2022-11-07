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
export interface UserInfo {
  userId: string;
  username: string;
  profilePic: string;
  dateJoined: string;
}

export interface MessageEntity {
  sender: string;
  content: string;
  timestamp: string;
}
