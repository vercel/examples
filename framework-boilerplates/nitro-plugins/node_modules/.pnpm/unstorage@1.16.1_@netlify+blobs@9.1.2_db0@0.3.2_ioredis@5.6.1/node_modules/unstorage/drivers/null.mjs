import { defineDriver } from "./utils/index.mjs";
const DRIVER_NAME = "null";
export default defineDriver(() => {
  return {
    name: DRIVER_NAME,
    hasItem() {
      return false;
    },
    getItem() {
      return null;
    },
    getItemRaw() {
      return null;
    },
    getItems() {
      return [];
    },
    getMeta() {
      return null;
    },
    getKeys() {
      return [];
    },
    setItem() {
    },
    setItemRaw() {
    },
    setItems() {
    },
    removeItem() {
    },
    clear() {
    }
  };
});
