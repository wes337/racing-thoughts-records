import localForage from "localforage";

export default class Cache {
  static instance;

  static {
    Cache.instance = localForage.createInstance({
      driver: localForage.INDEXEDDB,
      name: "rtr",
      version: 1.0,
    });
  }

  static async setItem(key, value, expiry) {
    if (typeof window === "undefined") {
      return;
    }

    const item = {
      value,
      expiry: expiry ? Date.now() + expiry * 1000 : null,
    };

    return Cache.instance.setItem(key, item);
  }

  static async getItem(key) {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      const item = await Cache.instance.getItem(key);

      if (!item) {
        return null;
      }

      if (item.expiry && Date.now() > item.expiry) {
        await Cache.removeItem(key);
        return null;
      }

      return item.value;
    } catch {
      return null;
    }
  }

  static async removeItem(key) {
    if (typeof window === "undefined") {
      return;
    }

    return Cache.instance.removeItem(key);
  }
}
