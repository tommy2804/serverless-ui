export interface GenericEventObj {
  id: string;
  name: string;
  photosSRC: string[];
  date: string;
  numOfPhoto: number;
  username: string;
  userphoto: string;
  ttl: number;
  location?: string;
  photographer_name?: string;
  missingPhotos?: number;
  giftRoot?: string;
  logo?: string;
  logoVersion?: number;
}
