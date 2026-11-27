import { utils } from "near-api-js";

export const numberToYocto = (price: number) =>
  price.toLocaleString().replace(/,/g, "");

export const yoctoToNear = (yocto: string) => {
  return utils.format.formatNearAmount(yocto);
};

export const nearToYocto = (balance: string) => {
  return utils.format.parseNearAmount(balance);
};
