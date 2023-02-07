const ip3country = {
  countryCodes: [],
  ipRanges: [],
  countryTable: [],

  init: function () {
    if (this._initCalled) {
      return;
    }

    this._initCalled = true;
    const ip_supalite = require("./ip_supalite");

    let index = 0;
    while (index < ip_supalite.length) {
      const c1 = ip_supalite[index++];
      const c2 = ip_supalite[index++];
      this.countryTable.push(
        "" + String.fromCharCode(c1) + String.fromCharCode(c2)
      );
      if (String.fromCharCode(c1) === "*") {
        break;
      }
    }

    let lastEndRange = 0;
    while (index < ip_supalite.length) {
      let count = 0;
      const n1 = ip_supalite[index++];
      if (n1 < 240) {
        count = n1;
      } else if (n1 == 242) {
        const n2 = ip_supalite[index++];
        const n3 = ip_supalite[index++];
        count = n2 | (n3 << 8);
      } else if (n1 == 243) {
        const n2 = ip_supalite[index++];
        const n3 = ip_supalite[index++];
        const n4 = ip_supalite[index++];
        count = n2 | (n3 << 8) | (n4 << 16);
      }

      lastEndRange += count * 256;
      const cc = ip_supalite[index++];
      this.ipRanges.push(lastEndRange);
      this.countryCodes.push(this.countryTable[cc]);
    }

    delete require.cache[require.resolve("./ip_supalite")];
  },

  lookupStr: function (ipaddrstr) {
    const components = ipaddrstr.split(".");
    if (components.length !== 4) {
      return null;
    }

    const ipNumber =
      parseInt(components[0]) * Math.pow(256, 3) +
      (parseInt(components[1]) << 16) +
      (parseInt(components[2]) << 8) +
      parseInt(components[3]);
    return this.lookupNumeric(ipNumber);
  },

  lookupNumeric: function (ipNumber) {
    if (!this.countryCodes) {
      throw new Error("ip3country::lookupNumeric> Please call init first");
    }

    const index = this.binarySearch(ipNumber);
    const cc = this.countryCodes[index];
    return cc === "--" ? null : cc;
  },

  binarySearch: function (value) {
    let min = 0;
    let max = this.ipRanges.length - 1;

    while (min < max) {
      const mid = (min + max) >>> 1;
      if (this.ipRanges[mid] <= value) {
        min = mid + 1;
      } else {
        max = mid;
      }
    }

    return min;
  },
};

module.exports = ip3country;
