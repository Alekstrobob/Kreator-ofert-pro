
export interface Service {
  id: string;
  name: string;
  category: 'catering' | 'venue' | 'entertainment' | 'logistics' | 'staff' | 'accommodation';
  unitPrice: number;
  taxRate: number; // e.g. 0.23 or 0.08
  unit: string;
  description?: string;
}

export interface SelectedService extends Service {
  quantity: number;
  isOptional?: boolean;
  targetGroups?: ('adults' | 'kidsUnder3' | 'kids4to10' | 'kids11to14')[];
}

export interface EventData {
  title: string;
  date: string; // Start date
  endDate: string; // End date
  location: string;
  attendees: number; // This represents Adults
  kidsUnder3: number;
  kids4to10: number;
  kids11to14: number;
  budget: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
  bannerUrl?: string | null;
}

export interface CompanyData {
  name: string;
  address: string;
  nip: string;
  website: string;
}

export interface OfferData {
  event: EventData;
  company: CompanyData;
  services: SelectedService[];
}
