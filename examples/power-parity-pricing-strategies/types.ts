export type Country = string;

export interface Product {
  id: string;
  price: number;
  name: string;
  description: string;
  image: string;
  discount?: number;
}