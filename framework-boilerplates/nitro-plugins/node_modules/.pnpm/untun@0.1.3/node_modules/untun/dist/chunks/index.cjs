'use strict';

const os = require('node:os');
const path = require('pathe');
const fs = require('node:fs');
const path$1 = require('node:path');
const https = require('node:https');
const node_child_process = require('node:child_process');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const path__default = /*#__PURE__*/_interopDefaultCompat(path);
const fs__default = /*#__PURE__*/_interopDefaultCompat(fs);
const path__default$1 = /*#__PURE__*/_interopDefaultCompat(path$1);
const https__default = /*#__PURE__*/_interopDefaultCompat(https);

const CLOUDFLARED_VERSION = process.env.CLOUDFLARED_VERSION || "2023.10.0";
const RELEASE_BASE = "https://github.com/cloudflare/cloudflared/releases/";
const cloudflaredBinPath = path__default.join(
  os.tmpdir(),
  "node-untun",
  process.platform === "win32" ? `cloudflared.${CLOUDFLARED_VERSION}.exe` : `cloudflared.${CLOUDFLARED_VERSION}`
);
const cloudflaredNotice = `
\u{1F525} Your installation of cloudflared software constitutes a symbol of your signature
   indicating that you accept the terms of the Cloudflare License, Terms and Privacy Policy.

\u276F License:         \`https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/license/\`
\u276F Terms:           \`https://www.cloudflare.com/terms/\`
\u276F Privacy Policy:  \`https://www.cloudflare.com/privacypolicy/\`
`;
const connRegex = /connection[ =]([\da-z-]+)/i;
const ipRegex = /ip=([\d.]+)/;
const locationRegex = /location=([A-Z]+)/;
const indexRegex = /connIndex=(\d)/;

const LINUX_URL = {
  arm64: "cloudflared-linux-arm64",
  arm: "cloudflared-linux-arm",
  x64: "cloudflared-linux-amd64",
  ia32: "cloudflared-linux-386"
};
const MACOS_URL = {
  arm64: "cloudflared-darwin-amd64.tgz",
  x64: "cloudflared-darwin-amd64.tgz"
};
const WINDOWS_URL = {
  x64: "cloudflared-windows-amd64.exe",
  ia32: "cloudflared-windows-386.exe"
};
function resolveBase(version) {
  if (version === "latest") {
    return `${RELEASE_BASE}latest/download/`;
  }
  return `${RELEASE_BASE}download/${version}/`;
}
function installCloudflared(to = cloudflaredBinPath, version = CLOUDFLARED_VERSION) {
  switch (process.platform) {
    case "linux": {
      return installLinux(to, version);
    }
    case "darwin": {
      return installMacos(to, version);
    }
    case "win32": {
      return installWindows(to, version);
    }
    default: {
      throw new Error("Unsupported platform: " + process.platform);
    }
  }
}
async function installLinux(to, version = CLOUDFLARED_VERSION) {
  const file = LINUX_URL[process.arch];
  if (file === void 0) {
    throw new Error("Unsupported architecture: " + process.arch);
  }
  await download(resolveBase(version) + file, to);
  fs__default.chmodSync(to, "755");
  return to;
}
async function installMacos(to, version = CLOUDFLARED_VERSION) {
  const file = MACOS_URL[process.arch];
  if (file === void 0) {
    throw new Error("Unsupported architecture: " + process.arch);
  }
  await download(resolveBase(version) + file, `${to}.tgz`);
  process.env.DEBUG && console.log(`Extracting to ${to}`);
  node_child_process.execSync(`tar -xzf ${path__default$1.basename(`${to}.tgz`)}`, { cwd: path__default$1.dirname(to) });
  fs__default.unlinkSync(`${to}.tgz`);
  fs__default.renameSync(`${path__default$1.dirname(to)}/cloudflared`, to);
  return to;
}
async function installWindows(to, version = CLOUDFLARED_VERSION) {
  const file = WINDOWS_URL[process.arch];
  if (file === void 0) {
    throw new Error("Unsupported architecture: " + process.arch);
  }
  await download(resolveBase(version) + file, to);
  return to;
}
function download(url, to, redirect = 0) {
  if (redirect === 0) {
    process.env.DEBUG && console.log(`Downloading ${url} to ${to}`);
  } else {
    process.env.DEBUG && console.log(`Redirecting to ${url}`);
  }
  return new Promise((resolve, reject) => {
    if (!fs__default.existsSync(path__default$1.dirname(to))) {
      fs__default.mkdirSync(path__default$1.dirname(to), { recursive: true });
    }
    let done = true;
    const file = fs__default.createWriteStream(to);
    const request = https__default.get(url, (res) => {
      if (res.statusCode === 302 && res.headers.location !== void 0) {
        const redirection = res.headers.location;
        done = false;
        file.close(() => resolve(download(redirection, to, redirect + 1)));
        return;
      }
      res.pipe(file);
    });
    file.on("finish", () => {
      if (done) {
        file.close(() => resolve(to));
      }
    });
    request.on("error", (err) => {
      fs__default.unlink(to, () => reject(err));
    });
    file.on("error", (err) => {
      fs__default.unlink(to, () => reject(err));
    });
    request.end();
  });
}

function startCloudflaredTunnel(options = {}) {
  const args = ["tunnel"];
  for (const [key, value] of Object.entries(options)) {
    if (typeof value === "string") {
      args.push(`${key}`, value);
    } else if (typeof value === "number") {
      args.push(`${key}`, value.toString());
    } else if (value === null) {
      args.push(`${key}`);
    }
  }
  if (args.length === 1) {
    args.push("--url", "localhost:8080");
  }
  const child = node_child_process.spawn(cloudflaredBinPath, args, {
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (process.env.DEBUG) {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  }
  const urlRegex = /\|\s+(https?:\/\/\S+)/;
  let urlResolver = () => void 0;
  let urlRejector = () => void 0;
  const url = new Promise(
    (...pair) => [urlResolver, urlRejector] = pair
  );
  const connectionResolvers = [];
  const connectionRejectors = [];
  const connections = [];
  for (let i = 0; i < 1; i++) {
    connections.push(
      new Promise(
        (...pair) => [connectionResolvers[i], connectionRejectors[i]] = pair
      )
    );
  }
  const parser = (data) => {
    const str = data.toString();
    const urlMatch = str.match(urlRegex);
    urlMatch && urlResolver(urlMatch[1]);
    const connMatch = str.match(connRegex);
    const ipMatch = str.match(ipRegex);
    const locationMatch = str.match(locationRegex);
    const indexMatch = str.match(indexRegex);
    if (connMatch && ipMatch && locationMatch && indexMatch) {
      const [, id] = connMatch;
      const [, ip] = ipMatch;
      const [, location] = locationMatch;
      const [, idx] = indexMatch;
      connectionResolvers[+idx]?.({ id, ip, location });
    }
  };
  child.stdout.on("data", parser).on("error", urlRejector);
  child.stderr.on("data", parser).on("error", urlRejector);
  const stop = () => child.kill("SIGINT");
  return { url, connections, child, stop };
}

exports.cloudflaredBinPath = cloudflaredBinPath;
exports.cloudflaredNotice = cloudflaredNotice;
exports.installCloudflared = installCloudflared;
exports.startCloudflaredTunnel = startCloudflaredTunnel;
