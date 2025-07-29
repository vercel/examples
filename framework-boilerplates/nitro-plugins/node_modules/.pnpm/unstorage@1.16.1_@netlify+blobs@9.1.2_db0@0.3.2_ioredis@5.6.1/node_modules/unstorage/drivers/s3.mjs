import {
  defineDriver,
  createRequiredError,
  normalizeKey,
  createError
} from "./utils/index.mjs";
import { AwsClient } from "aws4fetch";
const DRIVER_NAME = "s3";
export default defineDriver((options) => {
  let _awsClient;
  const getAwsClient = () => {
    if (!_awsClient) {
      if (!options.accessKeyId) {
        throw createRequiredError(DRIVER_NAME, "accessKeyId");
      }
      if (!options.secretAccessKey) {
        throw createRequiredError(DRIVER_NAME, "secretAccessKey");
      }
      if (!options.endpoint) {
        throw createRequiredError(DRIVER_NAME, "endpoint");
      }
      if (!options.region) {
        throw createRequiredError(DRIVER_NAME, "region");
      }
      _awsClient = new AwsClient({
        service: "s3",
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        region: options.region
      });
    }
    return _awsClient;
  };
  const baseURL = `${options.endpoint.replace(/\/$/, "")}/${options.bucket || ""}`;
  const url = (key = "") => `${baseURL}/${normalizeKey(key, "/")}`;
  const awsFetch = async (url2, opts) => {
    const request = await getAwsClient().sign(url2, opts);
    const res = await fetch(request);
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw createError(
        DRIVER_NAME,
        `[${request.method}] ${url2}: ${res.status} ${res.statusText} ${await res.text()}`
      );
    }
    return res;
  };
  const headObject = async (key) => {
    const res = await awsFetch(url(key), { method: "HEAD" });
    if (!res) {
      return null;
    }
    const metaHeaders = {};
    for (const [key2, value] of res.headers.entries()) {
      const match = /x-amz-meta-(.*)/.exec(key2);
      if (match?.[1]) {
        metaHeaders[match[1]] = value;
      }
    }
    return metaHeaders;
  };
  const listObjects = async (prefix) => {
    const res = await awsFetch(baseURL).then((r) => r?.text());
    if (!res) {
      console.log("no list", prefix ? `${baseURL}?prefix=${prefix}` : baseURL);
      return null;
    }
    return parseList(res);
  };
  const getObject = (key) => {
    return awsFetch(url(key));
  };
  const putObject = async (key, value) => {
    return awsFetch(url(key), {
      method: "PUT",
      body: value
    });
  };
  const deleteObject = async (key) => {
    return awsFetch(url(key), { method: "DELETE" }).then((r) => {
      if (r?.status !== 204 && r?.status !== 200) {
        throw createError(DRIVER_NAME, `Failed to delete ${key}`);
      }
    });
  };
  const deleteObjects = async (base) => {
    const keys = await listObjects(base);
    if (!keys?.length) {
      return null;
    }
    if (options.bulkDelete === false) {
      await Promise.all(keys.map((key) => deleteObject(key)));
    } else {
      const body = deleteKeysReq(keys);
      await awsFetch(`${baseURL}?delete`, {
        method: "POST",
        headers: {
          "x-amz-checksum-sha256": await sha256Base64(body)
        },
        body
      });
    }
  };
  return {
    name: DRIVER_NAME,
    options,
    getItem(key) {
      return getObject(key).then((res) => res ? res.text() : null);
    },
    getItemRaw(key) {
      return getObject(key).then((res) => res ? res.arrayBuffer() : null);
    },
    async setItem(key, value) {
      await putObject(key, value);
    },
    async setItemRaw(key, value) {
      await putObject(key, value);
    },
    getMeta(key) {
      return headObject(key);
    },
    hasItem(key) {
      return headObject(key).then((meta) => !!meta);
    },
    getKeys(base) {
      return listObjects(base).then((keys) => keys || []);
    },
    async removeItem(key) {
      await deleteObject(key);
    },
    async clear(base) {
      await deleteObjects(base);
    }
  };
});
function deleteKeysReq(keys) {
  return `<Delete>${keys.map((key) => {
    key = key.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return (
      /* xml */
      `<Object><Key>${key}</Key></Object>`
    );
  }).join("")}</Delete>`;
}
async function sha256Base64(str) {
  const buffer = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  const bytes = new Uint8Array(hash);
  const binaryString = String.fromCharCode(...bytes);
  return btoa(binaryString);
}
function parseList(xml) {
  if (!xml.startsWith("<?xml")) {
    throw new Error("Invalid XML");
  }
  const listBucketResult = xml.match(
    /<ListBucketResult[^>]*>([\s\S]*)<\/ListBucketResult>/
  )?.[1];
  if (!listBucketResult) {
    throw new Error("Missing <ListBucketResult>");
  }
  const contents = listBucketResult.match(
    /<Contents[^>]*>([\s\S]*?)<\/Contents>/g
  );
  if (!contents?.length) {
    return [];
  }
  return contents.map((content) => {
    const key = content.match(/<Key>([\s\S]+?)<\/Key>/)?.[1];
    return key;
  }).filter(Boolean);
}
