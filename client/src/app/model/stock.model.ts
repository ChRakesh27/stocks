export interface Stock {
  company: string;
  records: Record[];
}

export interface Record {
  percentage: string;
  price: string;
}
