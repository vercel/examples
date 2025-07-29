import { a as _WebSocket } from '../shared/crossws.CipVM6lf.mjs';
import 'stream';
import 'events';
import 'http';
import 'crypto';
import 'buffer';
import 'zlib';
import 'https';
import 'net';
import 'tls';
import 'url';

const Websocket = globalThis.WebSocket || _WebSocket;

export { Websocket as default };
