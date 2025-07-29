import { Preferences } from "@capacitor/preferences";
import { defineDriver, joinKeys, normalizeKey } from "./utils/index.mjs";
const DRIVER_NAME = "capacitor-preferences";
export default defineDriver(
  (opts) => {
    const base = normalizeKey(opts?.base || "");
    const resolveKey = (key) => joinKeys(base, key);
    return {
      name: DRIVER_NAME,
      options: opts,
      getInstance: () => Preferences,
      hasItem(key) {
        return Preferences.keys().then((r) => r.keys.includes(resolveKey(key)));
      },
      getItem(key) {
        return Preferences.get({ key: resolveKey(key) }).then((r) => r.value);
      },
      getItemRaw(key) {
        return Preferences.get({ key: resolveKey(key) }).then((r) => r.value);
      },
      setItem(key, value) {
        return Preferences.set({ key: resolveKey(key), value });
      },
      setItemRaw(key, value) {
        return Preferences.set({ key: resolveKey(key), value });
      },
      removeItem(key) {
        return Preferences.remove({ key: resolveKey(key) });
      },
      async getKeys() {
        const { keys } = await Preferences.keys();
        return keys.map((key) => key.slice(base.length));
      },
      async clear(prefix) {
        const { keys } = await Preferences.keys();
        const _prefix = resolveKey(prefix || "");
        await Promise.all(
          keys.filter((key) => key.startsWith(_prefix)).map((key) => Preferences.remove({ key }))
        );
      }
    };
  }
);
