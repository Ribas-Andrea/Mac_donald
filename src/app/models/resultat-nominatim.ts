export interface ResultatNominatim {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    postcode?: string;
    country?: string;
  }
};