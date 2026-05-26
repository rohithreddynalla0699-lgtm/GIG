export interface SupportTopic {
  id: string;
  title: string;
  description: string;
  guidance: string[];
}

export interface SupportCategory {
  id: string;
  title: string;
  description: string;
  topics: SupportTopic[];
}

export interface SupportContact {
  email: string;
  phone: string;
  hours: string;
}
