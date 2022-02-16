import products from "../mocks/products.json";

export const getProducts = (count: number) => {
  return products.slice(0, count);
};
